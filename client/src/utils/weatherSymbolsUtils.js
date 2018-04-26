import React from 'react';

export function getWeatherSymbolImage(symbol) {
    return symbol ? "/yr-weather-symbols/svg/" + getProperWeatherSymbol(symbol) + ".svg" : '';
}

function getProperWeatherSymbol(symbol) {
    const symbolsWithOnlyOneVariant = ['10', '04', '46', '09', '10', '30', '22', '11', '47', '12', '48', '31', '23', '32', '49', '13', '50', '33', '14', '34', '15'];

    if (symbolsWithOnlyOneVariant.some(availableSymbol => symbol.toString().includes(availableSymbol))) {
        return symbol.replace(/[^\d.]/g, '');
    }

    return symbol;
}

export function getProperWindArrowElement(degrees, white) {
    if (degrees) {
        const arrowStyles = {transform: 'rotate(' + degrees + 'deg)'};
        const arrowImage = white ? '/windArrowWhite.svg' : '/windArrowDark.svg';

        return (
            <img className="wind-arrow" style={arrowStyles} src={arrowImage} alt=""/>
        );
    }
}