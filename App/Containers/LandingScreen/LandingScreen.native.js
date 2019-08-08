// @flow
import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native'

import styles from './LandingScreen.style'
import moment from 'moment'
import _ from 'lodash'

class LandingScreen extends React.PureComponent {
  static navigationOptions = {
    title: 'Food Item',
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      foodName: '',
      showLoader: true,
      refreshing: false,
    }
    this.deleteItemCheck = false
    this.createItemCheck = false
    this.foodListCheck = true
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.getFoodList()
    }, 10)
  }

  componentWillReceiveProps(nextProps) {
    const { foodListResponse } = nextProps
    const foodListError = _.get(foodListResponse, 'foodListData.error', null)
    const foodListIsFetching = _.get(foodListResponse, 'foodListData.isFetching', false)
    const foodList = _.get(foodListResponse, 'foodListData.communities', [])

    if (this.foodListCheck) {
      if (!foodListIsFetching && foodListError == null && foodListResponse.foodListData != null) {
        this.setState({ showLoader: false, dataSource: foodList, refreshing: false })
        this.foodListCheck = false
      }
    }

    const createResponse = nextProps.createFoodDataResponse
    const createError = _.get(createResponse, 'error', null)
    const createIsFetching = _.get(createResponse, 'isFetching', false)

    if (this.createItemCheck) {
      if (!createIsFetching && createError == null) {
        this.createItemCheck = false
        this.foodListCheck = true
        nextProps.getFoodList()
        this.setState({ foodName: '' })
      }
    }

    const deleteResponse = nextProps.deleteFoodItemResponse
    const deleteError = _.get(deleteResponse, 'error', null)
    const deleteIsFetching = _.get(deleteResponse, 'isFetching', false)

    if (this.deleteItemCheck) {
      if (!deleteIsFetching && deleteError == null) {
        this.deleteItemCheck = false
        this.foodListCheck = true
        nextProps.getFoodList()
      }
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {/* {this._renderTopContainer()} */}
        {this._renderHeader()}
        {this._renderFoodList()}
        {this._renderActivityIndicator()}
      </SafeAreaView>
    )
  }

  _renderTopContainer = () => {
    return (
      <View style={styles.topContainer}>
        <View style={styles.leftContainer}>
          <TextInput
            style={styles.textInputStyle}
            placeholder="Food Item Name"
            onChangeText={text => this.setState({ foodName: text })}
            value={this.state.foodName}
          />
        </View>
        <View style={styles.rightContainer}>
          <TouchableOpacity
            style={styles.createButtonContainer}
            onPress={() => {
              this.onPressCreateButton()
            }}>
            <Text style={styles.createTextStyle}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderHeader = () => {
    return (
      <View style={styles.listHeader}>
        <Text style={styles.foodName}>photo</Text>
        <Text style={styles.dateCreated}>Decription</Text>
      </View>
    )
  }

  // searchFilterFunction = text => {
  //   this.setState({
  //     value: text,
  //   });

  //   const newData = this.state.arrayholder.filter(item => {
  //     const itemData = `${item.username.toUpperCase()}`;
  //     const textData = text.toUpperCase();

  //     return itemData.indexOf(textData) > -1;
  //   });
  //   this.setState({
  //     dataSource: newData,
  //   });
  // };

  // renderHeader = () => {
  //   return (
  //     <SearchBar
  //       placeholder="Search..."
  //       lightTheme
  //       round
  //       onChangeText={text => this.searchFilterFunction(text)}
  //       autoCorrect={false}
  //       value={this.state.value}
  //     />
  //   );
  // };

  _renderFoodList = () => {
    const { foodListResponse } = this.props
    const foodListIsFetching = _.get(foodListResponse, 'foodListData.isFetching', false)

    if (_.size(this.state.dataSource) > 0) {
      return (
        <View style={styles.flatListContainer}>
          <FlatList
            removeClippedSubviews={false}
            style={styles.flatList}
            ContentContainerStyle={styles.contentStyle}
            data={this.state.dataSource}
            extraData={this.props}
            renderItem={this.renderRow}
            keyExtractor={(item, index) => item.foodId}
            // keyExtractor={(item, index) => index.toString()}
            // ListHeaderComponent={this.renderHeader}
            onRefresh={() => {
              if (!foodListIsFetching) {
                this.fetchDataOnRefresh()
              }
            }}
            refreshing={this.state.refreshing}
          />
        </View>
      )
    } else if (!this.state.showLoader) {
      return (
        <View style={styles.nothingTextContainer}>
          <Text style={styles.nothingText}>Nothing Here.</Text>
          <Text style={styles.nothingText}>Plese enter some food items or</Text>
          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={() => {
              this.setState({ showLoader: true }, () => {
                this.fetchDataOnRefresh()
              })
            }}>
            <Text style={[styles.nothingText, styles.whiteColorText]}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  _renderActivityIndicator = () => {
    if (this.state.showLoader) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      )
    }
  }

  renderRow = ({ item }) => {
    return (
      <FlatListItem
        item={item}
        onPress={item => {
          this.onPressDeleteItem(item)
        }}
      />
    )
  }

  onPressDeleteItem = item => {
    this.setState({ showLoader: true })
    this.deleteItemCheck = true
    this.props.deleteFoodItem(item.foodId)
  }

  onPressCreateButton = () => {
    let alphabetRejex = /^[a-zA-Z\s]*$/
    const { foodName } = this.state

    if (!alphabetRejex.test(foodName) || foodName == '') {
      alert('Invalid Food Name, You can only use Alphabets.')
      return
    }
    this.setState({ showLoader: true })
    this.createItemCheck = true

    payload = {
      foodId: Math.random().toString(),
      name: foodName,
      dateCreated: moment(new Date()).format('DD/MM/YYYY'),
    }
    this.props.createFoodItem(payload)
  }

  fetchDataOnRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.foodListCheck = true
      this.props.getFoodList()
    })
  }
}

class FlatListItem extends Component {
  render() {
    return (
      <View style={styles.flatListItem}>
        <View style={{ flex: 1 }}>
          {this.props.item.photo ? (
            <Image source={{uri:this.props.item.photo}} style={{width:90, height:90}} resizeMode={'center'} />
          ) : (
            <Image source={{uri:"https://png2.kisspng.com/sh/b8a79dde37962585e9df306e0e74f02b/L0KzQYm3V8A0N5pvfZH0aYP2gLBuTfNwdaF6jNd7LXnmf7B6TgV0baMyeehqdHH1Pcb6hgIuPZM4etNvZUK4dIa4UckvP2k8Sqo8MEG0RYS3VsM5O2E7S6o7Mj7zfri=/kisspng-computer-icons-user-avatar-user-5b3bafe25d5119.7872830115306383063822.png"}} style={{width:100, height:100}} resizeMode={'center'} />
          )}
          
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent:'center' }}>
          <Text style={{height:0}}>{this.props.item._id}</Text>
          <Text style={styles.foodName}>{this.props.item.name}</Text>
          <Text style={styles.foodName}>{this.props.item.country}</Text>
          <Text style={styles.dateCreated}>{this.props.item.description}</Text>
        </View >

      {/* <TouchableOpacity
        style={styles.deleteItemContainer}
        onPress={() => {
          this.props.onPress(this.props.item)
        }}>
        <Image source={require('../../Assets/deleteIcon.png')} resizeMode={'center'} />
      </TouchableOpacity> */}
      </View >
    )
  }
}

export default LandingScreen
