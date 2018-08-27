import { StyleSheet, Dimensions } from 'react-native';
const {height, width} = Dimensions.get('window');
export default StyleSheet.create({
    hasDanger: {
      borderBottomColor: 'red',
      borderBottomWidth: 1
    },
    success: {
      borderBottomColor: 'blue',
      borderBottomWidth: 1
    },
    title: {
      color: 'white',
      fontSize: 20,
      fontWeight: '700',
    },
    container: {
      height: height,
      width: width,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'gainsboro'
    },
    submitBtn: {
      marginTop: height/30,
      width,
      height: height/10,
      backgroundColor: "#C95656",
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnFont: {
      color: 'white',
      fontSize: 20,
    },
    header: {
      height: height/10,
      width: width,
      backgroundColor: '#C95656',
    },
    content: {
      width: width
    }
});
