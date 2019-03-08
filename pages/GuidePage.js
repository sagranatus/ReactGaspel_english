import * as React from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, AsyncStorage, ScrollView } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import {NavigationEvents} from 'react-navigation'
var normalSize;
var largeSize;
AsyncStorage.getItem('textSize', (err, result) => {
  if(result == "normal" || result == null){
    normalSize = {fontSize:15}
    largeSize = {fontSize:17}
  }else if(result == "large"){
    normalSize = {fontSize:17}
    largeSize = {fontSize:19}
  }else if(result == "larger"){
    normalSize = {fontSize:19}
    largeSize = {fontSize:21}
  }
})

const FirstRoute = () => (
  <ScrollView style={[styles.scene, { backgroundColor: '#fff', paddingTop:10 }]}>
    <Text style={[styles.textStyle, {textAlign:'center', color:'#01579b'}, normalSize]}>
    "하느님의 말씀은 나에게 들려주시는 하느님의 편지다." {"\n"}(성 요한 크리소스토모) {"\n"}
    </Text>
    <Text style={[styles.textStyle, normalSize]}>
    하느님께서는 말씀으로 우리를 매 순간 초대하시고 함께 하십니다. {"\n"}
    성경은 인간 각자를 향한 하느님의 메시지로 ‘오늘, 지금 이 순간’에 ‘나’에게 말씀하고 계십니다.  {"\n"}
    하느님의 말씀은 마음의 양식의 깨끗하고 마르지 않는 샘이 되는 힘과 능력을 지니고 있습니다. {"\n"} {"\n"}

    성경을 읽을 때는 하느님과 인간의 대화가 이루어지도록 기도가 동반되어야 합니다.  {"\n"}
    왜냐하면 우리가 기도할 때에는 하느님께 말씀드리는 것이고, 하느님의 말씀을 읽을 때에는 하느님의 말씀을 듣기 때문입니다.  {"\n"}{"\n"}
  ‘거룩한 독서’는 이러한 과정을 우리가 할 수 있도록 돕는 기도와 함께하는 독서입니다.
  </Text>
  </ScrollView>
);
const SecondRoute = () => (
  <ScrollView style={[styles.scene, { backgroundColor: '#fff', paddingTop:10 }]}>
    <Text style={[styles.textStyle, normalSize]}>거룩한 독서는 하느님 말씀 안에서 이루어지는 하나의 총제적인 과정으로 6단계로 요약될 수 있습니다.{"\n"}{"\n"}
    <Text style={{color:'#01579b'}}>침묵</Text> - 하느님께 우리 마음의 주파수를 맞추려는 노력으로 하느님 말씀을 듣기 전에 차분한 마음 안에서 자신을 온전히 내려놓아야 합니다.{"\n"}{"\n"}

    <Text style={{color:'#01579b'}}>성령청원</Text> - 하느님의 말씀은 하느님께서 이끌어 주셔야만 올바로 알아들을 수 있고 성령의 도움 없이는 거룩한 독서 자체가 불가능합니다. 반드시 성령의 도움을 청해야 합니다.{"\n"}{"\n"}

    <Text style={{color:'#01579b'}}>독서</Text> - 하느님의 말씀을 듣는 것으로 성경 본문이 그 자체로 무엇을 말하고 있는가에 초점을 맞춰야 합니다. 세밀한 독서와 반복적인 독서가 필요하며, 말씀을 여러 차례 침묵 속에서 읽어야 합니다.{"\n"}{"\n"}

    <Text style={{color:'#01579b'}}>묵상</Text> - 말씀이 바로 나에게 지금 어떤 말을 걸고자 하는지에 대해 곰곰이 생각하며 노력을 기울이는 과정으로 하느님께서 지금 나에게 하고 계시는 말씀을 듣기 위해 노력해야 한다.{"\n"}{"\n"}

    <Text style={{color:'#01579b'}}>기도</Text> - 하느님께서 내게 주신 말씀을 되뇌이며 자연스럽게 솔직함과 그분께 대한 신뢰 안에서 하느님께 대답하는 과정입니다.{"\n"}{"\n"}

    <Text style={{color:'#01579b'}}>관상</Text> - 정신과 마음의 진정한 회개를 이끌어 내는 단계로, 모든 이와 모든 것을 하느님의 눈으로 바라보며 모든 것이 하느님의 은총임을 깨닫게 해주는 하느님의 선물입니다. {"\n"}
</Text>
  </ScrollView>
);
const ThirdRoute = () => (
  <ScrollView style={[styles.scene, { backgroundColor: '#fff' , paddingTop:10}]}>
  <Text style={[styles.textStyle, normalSize]}>
  <Text style={{color:'#01579b'}}>간단한 독서</Text> {"\n"}
– 평일 거룩한 독서를 하는 것이 어려운 분들을 위한 초보단계의 독서 방법입니다. 성령청원기도 -> 독서 -> 간단한 묵상 -> 기도의 과정을 포함합니다.{"\n"}{"\n"}

<Text style={{color:'#01579b'}}>거룩한 독서</Text> {"\n"}
– 평일의 거룩한 독서를 할 수 있는 독서 방법입니다. {"\n"}
성령청원기도 -> 독서(세밀하고, 반복적인 독서로 말씀을 온전히 읽기) -> 묵상(예수님 모습 찾기, 내게 해주시는 말씀 듣기) -> 기도의 과정을 포함합니다.{"\n"}{"\n"}

<Text style={{color:'#01579b',}}>주일의 독서</Text> {"\n"}
- 주일에 하는 거룩한 독서로 평일에 비해 조금 더 심화된 방법입니다.{"\n"}
거룩한 독서와 같은 방법이나 좀 더 심화된 과정입니다.{"\n"}
성령청원기도 -> 독서(배경지식 공부하기 / 세밀하고, 반복적인 독서로 말씀을 온전히 읽기) -> 묵상(예수님 모습 찾기, 내게 해주시는 말씀 듣기, 한주간 묵상할 구절 고르기) -> 기도 -> 관상(한주간 말씀을 품고 살기)의 과정을 포함합니다.
  </Text>
  </ScrollView>
);
const FourthRoute = () => (
  <ScrollView style={[styles.scene, { backgroundColor: '#fff', paddingTop:10 }]}>
  <Text style={[styles.textStyle, normalSize]}>
  <Text style={{color:'#01579b'}}>1) 정해진 침묵의 시간</Text> {"\n"}
 거룩한 독서 1단계인 침묵을 준비하기 위해 반드시 따로 시간을 내야 합니다. 외적 침묵이 없다면 하느님을 기다리는 일은 불가능합니다. 고요와 침묵과 고독에 도움이 되는 시간이어야 합니다. 조용한 장소에서 촛불을 켜고 진행하면 좋습니다.
{"\n"}{"\n"}
<Text style={{color:'#01579b'}}>2) 들을 귀가 있는 마음</Text>{"\n"}
급하게 해서는 안됩니다. 씨뿌리는 사람의 비유를 기억하십시오. 주님은 당신 말씀의 씨를 뿌리고 계시며 나 자신은 말씀이 떨어지는 땅입니다. 열매를 맺기 위해서는 좋은 땅이 준비되어야 합니다. 
{"\n"}{"\n"} 
<Text style={{color:'#01579b'}}>3) 지속적인 독서</Text>{"\n"}
꾸준함이 필요합니다. 지금 당장 성서 본문이 이해되지 않는다고 하더라도 지속적으로 연습하다보면 하느님의 말씀이 어느 순간 나의 마음을 울리게 될 것입니다. 인내 하십시오. 열매를 맺을 것입니다.
  </Text>
  </ScrollView>
);

export default class GuidePage extends React.Component {
 setChange(){
    console.log("setChange")
    AsyncStorage.getItem('textSize', (err, result) => {
      if(result == "normal" || result == null){
        normalSize = {fontSize:15}
        largeSize = {fontSize:17}
      }else if(result == "large"){
        normalSize = {fontSize:17}
        largeSize = {fontSize:19}
      }else if(result == "larger"){
        normalSize = {fontSize:19}
        largeSize = {fontSize:21}
      }
      this.setState({reload:true})   
    })
   
    
  }

  state = {
    index: 0,
    routes: [
      { key: 'first', title: '들어가며..', out: true },
      { key: 'second', title: '거룩한 독서' },
      { key: 'third', title: '앱 사용법' },
      { key: 'fourth', title: '주의사항' }
    ],
    out: false,
  };

  render() {
    console.log("Guide render")
    return (
   
      <View
      style={{
        flex: 1,
        paddingTop: 0,
        backgroundColor: '#1982f3',
      }}>
       <NavigationEvents
                onWillFocus={payload => {
                  this.setChange()
                }}
                />
        <TouchableOpacity
          activeOpacity = {0.9}
          style={{backgroundColor: '#01579b', padding: 10}}
          onPress={ () =>  this.props.navigation.navigate('Main1')}
          >
          <Text style={{color:"#FFF", textAlign:'left'}}>
              {"<"} BACK
          </Text>
        </TouchableOpacity>   
      <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          first: () => (
            <ScrollView style={[styles.scene, { backgroundColor: '#fff', paddingTop:10 }]}>
              <Text style={[styles.textStyle, {textAlign:'center', color:'#01579b'}, largeSize]}>
              하느님의 말씀은 {"\n"}나에게 들려주시는 하느님의 편지다. 
              </Text>
              <Text style={[styles.textStyle, {textAlign:'center', color:'#01579b', fontSize:14, marginTop:-5}]}>
              (성 요한 크리소스토모) {"\n"}
              </Text>
              <Text style={[styles.textStyle, normalSize]}>
              하느님께서는 말씀으로 우리를 매 순간 초대하시고 함께 하십니다. {"\n"}
              성경은 인간 각자를 향한 하느님의 메시지로 ‘오늘, 지금 이 순간’에 ‘나’에게 말씀하고 계십니다.  {"\n"}
              하느님의 말씀은 마음의 양식의 깨끗하고 마르지 않는 샘이 되는 힘과 능력을 지니고 있습니다. {"\n"} {"\n"}
          
              성경을 읽을 때는 하느님과 인간의 대화가 이루어지도록 기도가 동반되어야 합니다.  {"\n"}
              왜냐하면 우리가 기도할 때에는 하느님께 말씀드리는 것이고, 하느님의 말씀을 읽을 때에는 하느님의 말씀을 듣기 때문입니다.  {"\n"}{"\n"}
            ‘거룩한 독서’는 이러한 과정을 우리가 할 수 있도록 돕는 기도와 함께하는 독서입니다.
            </Text>
            </ScrollView>
          ),
          second: () => (
            <ScrollView style={[styles.scene, { backgroundColor: '#fff', paddingTop:10 }]}>
              <Text style={[styles.textStyle, normalSize]}>거룩한 독서는 하느님 말씀 안에서 이루어지는 하나의 총제적인 과정으로 6단계로 요약될 수 있습니다.{"\n"}</Text>
              <Text style={[{color:'#01579b', textAlign:'center'}, largeSize]}>침묵</Text> 
              <Text style={[styles.textStyle, normalSize]}>
              하느님께 우리 마음의 주파수를 맞추려는 노력으로 하느님 말씀을 듣기 전에 차분한 마음 안에서 자신을 온전히 내려놓아야 합니다.{"\n"}
              </Text>
              <Text style={[{color:'#01579b', textAlign:'center'}, largeSize]}>성령청원</Text>
              <Text style={[styles.textStyle, normalSize]}>
              하느님의 말씀은 하느님께서 이끌어 주셔야만 올바로 알아들을 수 있고 성령의 도움 없이는 거룩한 독서 자체가 불가능합니다. 반드시 성령의 도움이 필요합니다.{"\n"}
              </Text>
              <Text style={[{color:'#01579b', textAlign:'center'}, largeSize]}>독서</Text>
              <Text style={[styles.textStyle, normalSize]}>
              하느님의 말씀을 듣는 것으로 성경 본문이 그 자체로 무엇을 말하고 있는가에 초점을 맞춥니다. 세밀한 독서와 반복적인 독서가 필요하며, 말씀을 여러 차례 침묵 속에서 읽습니다.{"\n"}
              </Text>
              <Text style={[{color:'#01579b', textAlign:'center'}, largeSize]}>묵상</Text>
              <Text style={[styles.textStyle, normalSize]}>
              말씀이 바로 나에게 지금 어떤 말을 걸고자 하는지에 대해 곰곰이 생각하며 노력을 기울이는 과정으로 하느님께서 지금 나에게 하고 계시는 말씀을 듣기 위해 노력합니다.{"\n"}
              </Text>
              <Text style={[{color:'#01579b', textAlign:'center'}, largeSize]}>기도</Text>
              <Text style={[styles.textStyle, normalSize]}>
              하느님께서 내게 주신 말씀을 되뇌이며 자연스럽게 솔직함과 그분께 대한 신뢰 안에서 하느님께 대답합니다.{"\n"}
              </Text>
              <Text style={[{color:'#01579b', textAlign:'center'}, largeSize]}>관상</Text>
              <Text style={[styles.textStyle, normalSize]}>
              정신과 마음의 진정한 회개를 이끌어 내는 단계로, 모든 이와 모든 것을 하느님의 눈으로 바라보며 모든 것이 하느님의 은총임을 깨닫게 해주는 하느님의 선물입니다. {"\n"}
              </Text>
            </ScrollView>
          ),
          third: () => (
            <ScrollView style={[styles.scene, { backgroundColor: '#fff' , paddingTop:10}]}>
               
            <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>거룩한 독서{"\n"}</Text> 
            <Text style={[styles.textStyle, normalSize]}>       
          - 기본 : 성령청원기도 -> 독서 -> 간단한 묵상 -> 기도 {"\n"}
          - 심화 : 성령청원기도 -> 독서(세밀하고, 반복적인 독서) -> 묵상(예수님 모습 찾기, 내게 해주시는 말씀 듣기) -> 기도{"\n"}{"\n"}
          </Text>
          <Text style={[{color:'#01579b', textAlign:'center'}, largeSize]}>주일의 독서{"\n"}</Text> 
          <Text style={[styles.textStyle, normalSize]}>       
          *거룩한 독서와 같은 방법이나 좀 더 심화된 과정입니다.{"\n"}
          성령청원기도 -> 독서(배경지식 공부 / 세밀하고, 반복적인 독서) -> 묵상(예수님 모습 찾기, 내게 해주시는 말씀 듣기, 한주간 묵상할 구절 고르기) -> 기도 -> 관상(한주간 말씀을 품고 살기)
            </Text>
            </ScrollView>
          ),
          fourth: () => (
            <ScrollView style={[styles.scene, { backgroundColor: '#fff', paddingTop:10 }]}>
            
            <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>정해진 침묵의 시간</Text> 
            <Text style={[styles.textStyle, normalSize]}>
           거룩한 독서 1단계인 침묵을 준비하기 위해 반드시 따로 시간을 내야 합니다. 외적 침묵이 없다면 하느님을 기다리는 일은 불가능합니다. 고요와 침묵과 고독에 도움이 되는 시간이어야 합니다. 조용한 장소에서 촛불을 켜고 진행하면 좋습니다.
          {"\n"}
          </Text>
          <Text style={[{color:'#01579b', textAlign:'center'}, largeSize]}>들을 귀가 있는 마음</Text>
          <Text style={[styles.textStyle, normalSize]}>
          급하게 해서는 안됩니다. 씨뿌리는 사람의 비유를 기억하십시오. 주님은 당신 말씀의 씨를 뿌리고 계시며 나 자신은 말씀이 떨어지는 땅입니다. 열매를 맺기 위해서는 좋은 땅이 준비되어야 합니다. 
          {"\n"} 
          </Text>
          <Text style={[{color:'#01579b', textAlign:'center'}, largeSize]}>지속적인 독서</Text>
          <Text style={[styles.textStyle, normalSize]}>
          꾸준함이 필요합니다. 지금 당장 성서 본문이 이해되지 않는다고 하더라도 지속적으로 연습하다보면 하느님의 말씀이 어느 순간 나의 마음을 울리게 될 것입니다. 인내 하십시오. 열매를 맺을 것입니다.
            </Text>
            </ScrollView>
          )
        })}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
        renderTabBar={(props) =>
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#01579b' }}
            style={{backgroundColor: "white"}}
            renderIcon={this.renderIcon}
            renderLabel={({ route }) => (
              <View>
                  <Text style={{textAlign: 'center',
                     color: route.key === props.navigationState.routes[props.navigationState.index].key ?
                      '#01579b' : 'black'}}>
                                            {route.title}
                  </Text>
              </View>)}
          /> }
      />
     
     </View>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    color:'red'
  },
  textStyle:{ backgroundColor: '#fff', color:'#000', lineHeight:25, fontSize:15, margin:5 }
});
