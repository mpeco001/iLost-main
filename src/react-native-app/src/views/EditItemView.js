import React from 'react';
import {
  AsyncStorage,
  Dimensions,
  Image,
  ImagePickerIOS,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Button from '../components/Button';
import {
  color,
  fullPageView,
  mainFont,
  mainFontBold,
  style,
} from '../styles/variables';

const CAMERA_ICON = require('../../assets/images/icons/camera.png');

export default class EditItemView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      photoURI: null,
      itemName: '',
    };
  }

  componentWillMount() {
    const { name, id, imageSource } = this.props.navigation.state.params;
    this.setState({
      id,
      itemName: name,
      photoURI: imageSource,
    });
  }

  _addImage = () => {
    ImagePickerIOS.openSelectDialog({},
      (uri) => {
        this.setState({ photoURI: uri });
      },
      () => {
        console.log('handle selecting cancel here');
      });
  };

  _handleTextInputChange = (text) => {
    this.setState({ itemName: text });
  };

  _saveButtonHandler = async () => {
    // get current items
    try {
      const { index } = this.props.navigation.state.params;
      const user = JSON.parse(await AsyncStorage.getItem('user'));

      if (user) {
        user.items[index] = {
          ...user.items[index],
          name: this.state.itemName,
          image: this.state.photoURI,
        };
        await AsyncStorage.mergeItem('user', JSON.stringify(user));
        this.props.navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    }

  };

  render() {
    const { params } = this.props.navigation.state;
    const { photoURI, itemName } = this.state;
    const imageSource = photoURI ? { uri: photoURI } : CAMERA_ICON;

    return (
      <View style={styles.container}>
        <View style={{ flex: 3, alignItems: 'center', }}>
          <Text style={styles.title}>Edit Item</Text>

          <TouchableWithoutFeedback
            onPress={() => this._addImage()}
          >
            <Image
              style={styles.image}
              source={imageSource}
            />
          </TouchableWithoutFeedback>

          <TextInput
            placeholder="Item Name"
            onChangeText={(text) => this._handleTextInputChange(text)}
            maxLength={16}
            value={itemName}
            style={styles.textInput}
          />

        </View>
        <View style={{ flex: 1 }}>
          <Button
            text="OK"
            handler={() => this._saveButtonHandler()}
          />
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={styles.cancelButton}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const { height, width } = Dimensions.get('window');

const styles = {
  container: {
    ...style.container,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 50,
    flex: 1,
    maxHeight: height,
  },
  title: {
    ...fullPageView.title,
  },
  textInput: {
    fontFamily: mainFont,
    fontSize: 20,
    textAlign: 'center',
    width: width * 0.5,
    color: color.main,
  },
  image: {
    borderRadius: width / 5,
    width: width / 2.5,
    height: width / 2.5,
    marginTop: 50,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexShrink: 1,
  },
  cancelButton: {
    fontFamily: mainFontBold,
    color: color.main,
    fontSize: 14,
    textAlign: 'center',
  },
};