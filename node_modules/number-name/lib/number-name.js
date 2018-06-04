/* global DEBUG, module, self */

(function ()
{
    'use strict';
    
    function magnitudeOf(abs)
    {
        var magnitude = Math.floor(Math.log10(abs));
        if (isFinite(magnitude))
        {
            if (abs < intPow10(magnitude))
                --magnitude;
            else if (abs >= intPow10(magnitude + 1))
                ++magnitude;
        }
        return magnitude;
    }
    
    function makeFracDigits(significand, digitOffset)
    {
        var digits = [];
        for (; digitOffset < 0 && !(significand % 10); ++digitOffset)
            significand /= 10;
        for (; digitOffset < 0; ++digitOffset)
        {
            var digit = significand % 10;
            digits.unshift(digit);
            significand = (significand - digit) / 10;
        }
        return digits;
    }
    
    function makeIntDigits(significand, digitOffset)
    {
        var digits = [];
        if (digitOffset > 0)
            digits.length = digitOffset;
        else
            significand = Math.floor(significand / intPow10(-digitOffset));
        while (significand)
        {
            var digit = significand % 10;
            digits.push(digit);
            significand = (significand - digit) / 10;
        }
        return digits;
    }
    
    function nameOfIntDigits(digits)
    {
        if (!digits.length)
            return UNIT_NAMES[0];
        var name;
        for (var groupIndex = 0; ; ++groupIndex)
        {
            var digitIndex = groupIndex * 3;
            var group = digits.slice(digitIndex, digitIndex + 3);
            if (!group.length)
                break;
            var units = (group[0] || 0) + (group[1] * 10 || 0);
            var hundreds = group[2] || 0;
            if (units || hundreds)
            {
                var hundredName;
                if (hundreds)
                    hundredName = UNIT_NAMES[hundreds] + ' hundred';
                var unitName;
                if (units)
                {
                    if (units < 20)
                        unitName = UNIT_NAMES[units];
                    else
                    {
                        unitName = TEN_NAMES[units / 10 ^ 0];
                        var lowUnits = units % 10;
                        if (lowUnits)
                            unitName += '-' + UNIT_NAMES[lowUnits];
                    }
                }
                var groupName =
                    hundreds ? units ? hundredName + ' ' + unitName : hundredName : unitName;
                if (groupIndex)
                    groupName += ' ' + nameOfGroup(groupIndex - 1);
                name = groupName + (name ? ' ' + name : '');
            }
        }
        return name;
    }
    
    function numberName(number)
    {
        number = Number(number);
        if (!isFinite(number))
            return;
        var abs = Math.abs(number);
        var magnitude = magnitudeOf(abs);
        for (var precisionm1 = 0; magnitude > PRECISION_LIMITS[precisionm1]; ++precisionm1);
        var digitOffset = abs && magnitude - precisionm1;
        var significand = Math.round(abs / intPow10(digitOffset));
        if (!isFinite(significand))
            significand = 0;
        var intDigits = makeIntDigits(significand, digitOffset);
        var fracDigits = makeFracDigits(significand, digitOffset);
        var name = (number < 0 && significand ? 'minus ' : '') + nameOfIntDigits(intDigits);
        var fracDigitCount = fracDigits.length;
        if (fracDigitCount)
        {
            name += ' point';
            for (var fracDigitIndex = 0; fracDigitIndex < fracDigitCount; ++fracDigitIndex)
            {
                var fracDigit = fracDigits[fracDigitIndex];
                name += ' ' + UNIT_NAMES[fracDigit];
            }
        }
        return name;
    }
    
    function setUp(self)
    {
        if (self != null)
        {
            Object.defineProperty(
                self,
                'numberName',
                { configurable: true, value: numberName, writable: true }
            );
        }
    }
    
    function toString()
    {
        return 'numberName';
    }
    
    var UNIT_NAMES =
    [
        'zero',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen',
    ];
    
    var TEN_NAMES =
        [, , 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    var PRECISION_LIMITS =
    [
        -321, -319, -318, -315, -313, -311, -309, -307, -306, -303, -301, -299, -298, -295,
        Infinity
    ];
    
    var intPow10 =
        (function ()
        {
            var cache = Object.create(null);
            
            function intPow10(number)
            {
                var result = cache[number] || (cache[number] = eval('1e' + number));
                return result;
            }
            
            return intPow10;
        }
        )();
    
    var nameOfGroup =
        (function ()
        {
            var SINGLE_NAMES =
            [
                'thousand',
                'million',
                'billion',
                'trillion',
                'quadrillion',
                'quintillion',
                'sextillion',
                'septillion',
                'octillion',
                'nonillion'
            ];
            
            var TEN_NAMES =
            [
                ,
                'decillion',
                'vigintillion',
                'trigintillion',
                'quadragintillion',
                'quinquagintillion',
                'sexagintillion',
                'septuagintillion',
                'octogintillion',
                'nonagintillion',
                'centillion',
            ];
            
            var UNIT_NAMES =
            [
                '',
                'un',
                'duo',
                'tre',
                'quattuor',
                'quin',
                'sex',
                'septen',
                'octo',
                'novem'
            ];
            
            var cache = [];
            
            function calculate(number)
            {
                var name;
                if (number < 10)
                    name = SINGLE_NAMES[number];
                else
                    name = UNIT_NAMES[number % 10] + TEN_NAMES[number / 10 ^ 0];
                cache[number] = name;
                return name;
            }
            
            function nameOfGroup(number)
            {
                var name = cache[number] || calculate(number);
                return name;
            }
            
            return nameOfGroup;
        }
        )();
    
    (function ()
    {
        Object.defineProperty(
            numberName,
            'toString',
            { configurable: true, value: toString, writable: true }
        );
        
        // istanbul ignore else
        if (typeof DEBUG === 'undefined' || /* istanbul ignore next */ DEBUG)
        {
            var debug = { };
            
            Object.defineProperties(
                debug,
                {
                    PRECISION_LIMITS:
                    {
                        configurable: true,
                        value: PRECISION_LIMITS,
                        writable: true
                    },
                    setUp: { configurable: true, value: setUp, writable: true }
                }
            );
            
            Object.defineProperty(
                numberName,
                'debug',
                { configurable: true, value: debug, writable: true }
            );
        }
        
        setUp(typeof self !== 'undefined' ? /* istanbul ignore next */ self : null);
        
        // istanbul ignore else
        if (typeof module !== 'undefined')
            module.exports = numberName;
    }
    )();
}
)();
