import {
  numberLiteralTypeAnnotation,
  numberTypeAnnotation,
  numericLiteral
} from '@babel/types'
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  TouchableHighlight,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'
import CalendarStrip from 'react-native-calendar-strip'
import LinearGradient from 'react-native-linear-gradient'

const url = 'https://weight-checker-maria.herokuapp.com'
// const url = 'http://localhost:3000'

const App = () => {
  const [text, setText] = useState('')
  const [weights, setWeights] = useState([])
  const [hello, setHello] = useState({})
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    getUserId()
    return () => {}
  }, [])

  useEffect(() => {
    if (userId) {
      fetchWeights()
    }
  }, [userId])

  const getUserId = async () => {
    try {
      let uId = await AsyncStorage.getItem('userId')

      if (uId === null) {
        uId = Math.random().toString()
        await AsyncStorage.setItem('userId', uId)
      }

      setUserId(uId)
    } catch (error) {
      console.log(error)
    }
  }

  // const addWeight = () => {
  //   setWeights([{ text, key: Math.random() }, ...weights])
  //   setText('')
  // }
  // console.log(weights)

  const isActive = () => /^[+-]?(\d+\.?\d*|\.\d+)$/.test(text)

  // const fetchHello = async () => {
  //   try {
  //     const { data } = await axios.get('http://localhost:3000/hello')

  //     setHello(data)
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  const fetchWeights = async () => {
    try {
      const { data } = await axios.get(`${url}/weights?userId=${userId}`)
      console.log(data)
      setWeights(data.weights)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const addWeight = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${url}/weights?userId=${userId}`, {
        text
      })

      if (data.weight) {
        // fetchWeights()
        setWeights([data.weight, ...weights])
      }
      setText('')
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteWeight = async key => {
    setLoading(true)
    try {
      const { data } = await axios.delete(
        `${url}/weights/${key}?userId=${userId}`
      )
      if (data.weight) {
        setWeights(weights.filter(item => data.weight.key !== item.key))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  const datesWhitelist = [
    // single date (today)
    moment(),

    // date range
    {
      start: moment().add(-365, 'days'),
      end: moment()
    }
  ]

  return (
    <LinearGradient
      colors={['#FBEEE7', 'white', '#FFA16F']}
      style={{
        flex: 1
      }}
    >
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: Platform.OS === 'ios' ? 50 : 20
        }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <CalendarStrip
          datesWhitelist={datesWhitelist}
          scrollable
          scrollerPaging
          selectedDate={moment()}
          rightSelector={[]}
          leftSelector={[]}
          style={{
            height: 120,
            marginBottom: -25
          }}
          calendarHeaderStyle={{ fontSize: 20 }}
          dateNumberStyle={{ fontSize: 18 }}
          dateNameStyle={{
            fontSize: 10,
            marginBottom: Platform.OS === 'ios' ? -2 : -5
          }}
          disabledDateNameStyle={{
            color: 'grey',
            fontSize: 10,
            marginBottom: Platform.OS === 'ios' ? -2 : -5
          }}
          disabledDateNumberStyle={{ color: 'grey', fontSize: 18 }}
          highlightDateNameStyle={{
            color: 'white',
            fontSize: 10,
            marginBottom: Platform.OS === 'ios' ? -2 : -5
          }}
          highlightDateNumberStyle={{ color: 'white', fontSize: 18 }}
          highlightDateContainerStyle={{ backgroundColor: '#FC732D' }}
          dayContainerStyle={{
            borderColor: 'black',
            borderRadius: 50,
            backgroundColor: '#FEE4D6',

            borderWidth: 0 // поставить тернарку, обвести в круг сегодняшнюю дату
          }}
        />
        <Text>{hello.hello}</Text>
        {!isActive() && !!text && (
          <Text
            style={{
              color: 'red',
              paddingHorizontal: 16,
              fontSize: 12
            }}
          >
            Введите число!
          </Text>
        )}
        <View
          style={{
            alignItems: 'center',

            flexDirection: 'row'
          }}
        >
          <TextInput
            placeholder="Отметьте свой вес ✓"
            style={{
              borderWidth: 1,
              borderColor: isActive() ? '#059993' : 'gray',
              height: 50,
              paddingHorizontal: 10,
              flex: 1,
              marginRight: 5,
              borderRadius: 5,
              fontSize: 16,
              backgroundColor: 'white'
            }}
            onChangeText={t => setText(t.replace(',', '.').trim())}
            value={text}
            keyboardType={'decimal-pad'}
            maxLength={5}
          />
          <TouchableOpacity
            onPress={() => {
              if (isActive()) {
                addWeight()
              } else {
                Alert.alert('Введите число!')
              }
            }}
            activeOpacity={isActive() ? 0.5 : 1}
            style={{
              borderColor: isActive() ? '#059993' : 'gray',
              borderWidth: 1,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isActive() ? '#059993' : 'lightgrey',
              width: 50,
              borderRadius: 5
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>OK</Text>
          </TouchableOpacity>
        </View>
        <View>
          <SwipeListView
            data={weights}
            renderItem={data => (
              <LinearGradient
                colors={['white', '#FBEEE7']}
                style={{
                  borderColor: '#FC732D',
                  borderWidth: 0.5,
                  height: 80,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#b3edfb',
                  borderRadius: 5,
                  marginTop: 10
                }}
              >
                <Text style={{ fontSize: 28 }}>
                  Ваш вес {data.item.text} кг!
                </Text>
              </LinearGradient>
            )}
            renderHiddenItem={(data, rowMap) => (
              <View
                style={{
                  alignItems: 'center',

                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingLeft: 15,
                  marginTop: 10,
                  backgroundColor: '#00e782',
                  borderRadius: 5
                }}
              >
                {/* <Text>Left</Text> */}
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    bottom: 0,
                    justifyContent: 'center',
                    position: 'absolute',
                    top: 0,
                    width: 75,
                    backgroundColor: '#00e782',
                    right: 75
                  }}
                  onPress={() => {}}
                >
                  <Icon name="edit" size={25} color="white" />
                  <Text
                    style={{ color: 'white', marginBottom: -10, marginTop: 2 }}
                  >
                    Изменить
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    bottom: 0,
                    justifyContent: 'center',
                    position: 'absolute',
                    top: 0,
                    width: 75,
                    backgroundColor: '#ee2502',
                    right: 0,
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5
                  }}
                  onPress={() => {
                    deleteWeight(data.item.key)
                  }}
                >
                  <Icon name="trash" size={25} color="white" />
                  <Text
                    style={{ color: 'white', marginBottom: -10, marginTop: 2 }}
                  >
                    Удалить
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            disableRightSwipe
            leftOpenValue={0}
            rightOpenValue={-150}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            onRowDidOpen={rowKey => {
              console.log('This row opened', rowKey)
            }}
          />
        </View>
        {/* <View>
        {weights.map(w => (
          <View
            key={w.id}
            style={{
              borderColor: '#6C85EB',
              borderWidth: 1,
              height: 80,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#B0C0FF',
              borderRadius: 5,
              marginTop: 5
            }}
          >
            <Text style={{ fontSize: 28 }}>Ваш вес {w.text} кг!</Text>
          </View>
        ))}
      </View> */}
      </View>
    </LinearGradient>
  )
}

export default App
