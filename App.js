import {
  numberLiteralTypeAnnotation,
  numberTypeAnnotation,
  numericLiteral
} from '@babel/types'
import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  TouchableHighlight,
  StyleSheet
} from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import Icon from 'react-native-vector-icons/FontAwesome'

const App = () => {
  const [text, setText] = useState('')
  const [weights, setWeights] = useState([])

  const addWeight = () => {
    setWeights([{ text, key: Math.random() }, ...weights])
    setText('')
  }
  console.log(weights)

  const isActive = () => /^[+-]?(\d+\.?\d*|\.\d+)$/.test(text)
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 20
      }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
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
          placeholder="Отметьте свой вес"
          style={{
            borderWidth: 1,
            borderColor: isActive() ? 'black' : 'gray',
            height: 40,
            paddingHorizontal: 10,
            flex: 1,
            marginRight: 5,
            borderRadius: 5,
            fontSize: 14
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
            borderColor: isActive() ? '#344BA3' : 'gray',
            borderWidth: 1,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isActive() ? '#344BA3' : 'lightgray',
            width: 40,
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
            <View
              style={{
                borderColor: 'skyblue',
                borderWidth: 1,
                height: 80,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#b3edfb',
                borderRadius: 5,
                marginTop: 5
              }}
            >
              <Text style={{ fontSize: 28 }}>Ваш вес {data.item.text} кг!</Text>
            </View>
          )}
          renderHiddenItem={(data, rowMap) => (
            <View
              style={{
                alignItems: 'center',

                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: 15,
                marginTop: 5,
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
                <Text>Изменить</Text>
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
                  setWeights(weights.filter(item => data.item.key !== item.key))
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
  )
}

export default App
