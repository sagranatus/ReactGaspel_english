import React from 'react';
import PropTypes from 'prop-types';
import {
    View, 
    StyleSheet
} from 'react-native';
import Button from './Button';
import LinkButton from './LinkButton';

const OnboardingButton = ({
    totalItems,
    currentIndex,
    movePrevious,
    moveNext,
    moveFinal
}) => (
    <View style = {styles.container}>
        <LinkButton style = {styles.button} onPress={movePrevious} active={currentIndex > 0}>
            prev
        </LinkButton>
        {currentIndex === totalItems -1 ? (
            <Button style = {styles.button} onPress={moveFinal}>
               complete
            </Button>
        ) : (
            <Button style = {styles.button} onPress={moveNext} active={currentIndex < totalItems - 1}>
               next
            </Button>
        )}
       
    </View>
);

OnboardingButton.propTypes = {
    totalItems: PropTypes.number.isRequired,
    currentIndex: PropTypes.number.isRequired,
    movePrevious: PropTypes.func.isRequired,
    moveNext: PropTypes.func.isRequired,
    moveFinal: PropTypes.func.isRequired
};

const styles = StyleSheet.create({  
    container:{
        width:'100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: '#fff'        
    },
    button:{
        margin:0,
        width:120,
        height:40,
        borderWidth:1,
        
    }
});

export default OnboardingButton;