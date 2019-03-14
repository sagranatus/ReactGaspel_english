import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    ViewPropTypes
} from 'react-native';

import Button from './Button';

const LinkButton = ({style, children, ...rest}) => (
    <Button
    {...rest}
    style={[styles.button, style]}
    >
        {children}
    </Button>
);


LinkButton.propTypes = {
    style: ViewPropTypes.style,
    children: PropTypes.node
};

const styles = StyleSheet.create({
    button:{
        margin:0,
        width:120,
        height:40,
        borderWidth:1,
    }
});

export default LinkButton;