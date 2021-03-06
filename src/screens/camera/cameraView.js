import React from 'react';
import { PanResponder, NetInfo, TouchableHighlight, Image, Alert, CameraRoll, Vibration, Button, Text, View, TouchableOpacity, Dimensions, StyleSheet, AsyncStorage } from 'react-native';
import { Camera, Permissions, FileSystem, Font, ImageManipulator } from 'expo';
import { Container, Header, Content, Spinner } from 'native-base';
import {Ionicons} from '@expo/vector-icons';
import {CacheManager} from "react-native-expo-image-cache";
import styles from './styles';

export default class CameraDiv extends React.Component {
  constructor(){
    super();
    this.state = {
      hasCameraPermission: true,
      type: Camera.Constants.Type.back,
      dblClick: false,
      btnDisable: false,
      blink: false,
      photoTaken: false,
      iconFlash: "ios-flash-outline",
      iconCamera: "ios-reverse-camera-outline",
      flashMode: Camera.Constants.FlashMode.off
    };
  }
  componentDidMount(){
    const { activeAlbum, navigation: {navigate}, token } = this.props;
    if (!token) navigate('titleScreen');
    this.setState({ photoTaken: false });
    this.setState({ btnDisable: false });

  }


  componentWillMount() {
    const { updateConnection } = this.props;
    const dispatchConnected = isConnected => updateConnection(isConnected);

    NetInfo.isConnected.fetch().then().done(() => {
      NetInfo.isConnected.addEventListener('connectionChange', dispatchConnected);
    });
    // const { status } = await Permissions.askAsync(Permissions.CAMERA);
    // this.setState({ hasCameraPermission: status === 'granted' });
  }

  componentDidUpdate(){
    const { picSaved, navigation:{ navigate }, navigation} = this.props;
    if (picSaved) {
      navigation.state.params.item();
      navigate('library');
    }
  }
  savePhoto = async (data) => {

    const { savePhoto, activeAlbum: { name, pics }, savePicToAPI, token, isConnected, navigation: { navigate }, navigation } = this.props;

    const { exif, uri } = data;
    const key = `@${name.replace(/\s/, '_').toLowerCase()}:${pics.length}`

    if (isConnected){
      savePicToAPI({user_id: token, name, exif, uri});
    } else {
      // if not connected to internet, saves pic to cache for later saving to api.
      try {
        await AsyncStorage.setItem(key, uri);
      } catch (error) {
        Alert.alert('Error. Try Again');
      } finally {
        savePhoto(key, exif.Orientation);
      }
    }
  }

  _rotate = async (uri) =>{

    const manipResult = await ImageManipulator.manipulate(
      uri,
      [{ rotate: 180}],
        { format: 'png' }
      );
      return manipResult
  }

  _shoot = async () => {
    //disables button from being clicked twice
    this.setState({ btnDisable: true });

    //this add flash effect to camera
    // const self = this;
    // this.setState({hasCameraPermission: false});
    // setTimeout(()=>self.setState({hasCameraPermission: true}), 0);

    if (this.camera) {
      this.camera.takePictureAsync({ quality: 1, exif: true }).then(data => {
        let uri = data.uri;
        CacheManager.cache(uri, newURI => this.setState({ uri: newURI }));

        // Rotation occurs if pic is upside down. Don't cache pic after this fires.
        if (data.exif.Orientation === 90) {
          uri = this._rotate(uri);
        }

        this.setState({ photoTaken: true });
        this.savePhoto(data);

      });
    }
  };

  reset() {
    this.setState({bool: false});
  }

  dblClick() {
     if (this.state.dblClick){
       if (this.state.type === Camera.Constants.Type.back) this.setState({type: Camera.Constants.Type.front});
       else this.setState({type: Camera.Constants.Type.back})
     }
     else {
       this.setState({dblClick: true});
     }
     //detect touble tap below
     setTimeout(() => {
       this.setState({dblClick: false})
     }, 400);
   }

  typeConfig() {
    if (this.state.type === Camera.Constants.Type.back) {
      this.setState({type: Camera.Constants.Type.front});
      this.setState({iconCamera: "ios-reverse-camera"});
    }
    else {
      this.setState({type: Camera.Constants.Type.back});
      this.setState({iconCamera: "ios-reverse-camera-outline"});

    }
   }

  flashConfig() {
    if (this.state.flashMode === Camera.Constants.FlashMode.on) {
      this.setState({flashMode: Camera.Constants.FlashMode.off});
      this.setState({iconFlash: "ios-flash-outline"});
    }
    else {
      this.setState({flashMode: Camera.Constants.FlashMode.on});
      this.setState({iconFlash: "ios-flash"});

    }
  }


  render() {
    const { hasCameraPermission } = this.state;
    const {height, width} = Dimensions.get('window');
    const {type, blink, photoTaken, flashMode, zoom, btnDisable, iconFlash, iconCamera} = this.state;


    if (hasCameraPermission === null) return <View />;
    else if (hasCameraPermission === false) return <Text>No access to camera</Text>;
    else {
      const { activeAlbum: {name}, navigation: {navigate} } = this.props;
      return (
        <View>
          <View style={styles.topBanner}>
            <TouchableOpacity style={styles.titleContainer} onPress={ () => navigate('library') } underlayColor='white'>
              <Text style={styles.text} >{ name } &nbsp;</Text>
              <Ionicons style={styles.iconTop} name="ios-arrow-down-outline" size={32} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableHighlight onPress={this.dblClick.bind(this)} activeOpacity={1}>
            <Camera
              style={styles.camStyle}
              flashMode={flashMode}
              type={type}
              autofocus={"on"}
              ref={(camera) => { this.camera = camera; }}>
              {
                photoTaken ?
                  <View style={styles.flash}>
                      <Spinner color='#fff' />
                  </View> :
                <View style={styles.filmCircle}>
                  <View style={styles.miniTopHalf}></View>
                  <View style={styles.miniBottomHalf}></View>
                </View>
              }
            </Camera>
          </TouchableHighlight>

          <View style={styles.bottomBanner}>
            <TouchableOpacity onPress={this.flashConfig.bind(this)} style={styles.icon} underlayColor='white'>
              <Ionicons name={iconFlash} size={48} color="white" />
            </TouchableOpacity>

            <View style={styles.circle}>
              <TouchableOpacity disabled={ btnDisable } onPress={() => this._shoot()} underlayColor="white">
                <View style={styles.miniCircle}></View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={this.typeConfig.bind(this)} style={styles.icon} underlayColor='white'>
              <Ionicons name={iconCamera} size={48} color="white" />
            </TouchableOpacity>
          </View>

        </View>
      );
    }
  }
}
