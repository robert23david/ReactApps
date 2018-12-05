import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import MobileDetect from 'mobile-detect';
import _ from 'lodash';

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

class SelectOption extends React.Component {

    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
    }

    _onChange() {
        const { value, onSelect } = this.props;
        this.setState({ value });
        this.setState({ filled: true });

        onSelect(value);
    }

    mobile() {
        const { value, label, index, inputId, selectedValue } = this.props;
        const id = `${inputId}-option-${index}`;

        let selected = false;
        if (selectedValue === value) {
            selected = true;
        }

        return <option value={value}>{label}</option>
    }

    // desktop() {
    //     const { value, label, index, inputId, selectedValue } = this.props;
    //     const id = `${inputId}-option-${index}`;
    //
    //     let selected = false;
    //     if (selectedValue === value) {
    //         selected = true;
    //     }
    //
    //     return (
    //         <li>
    //             <input type="radio" value={value} id={id} checked={selected} onChange={this._onChange} />
    //             <label htmlFor={id}>{label}</label>
    //         </li>
    //     );
    // }

    render() {
        const { isMobile } = this.props;

        return this.mobile();
    }
}
SelectOption.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    label: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    inputId: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    selectedValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    isMobile: PropTypes.bool
};
SelectOption.defaultProps = {
    isMobile: false
};

export default class Select extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            selectedValue: null,
            filled: false,
            value: '',
            focusClass: ''
        };

        const md = new MobileDetect(window.navigator.userAgent);
        this.isMobile = md.mobile() !== null;

        this._onClick = this._onClick.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.onOptionSelect = this.onOptionSelect.bind(this);
        this.onOptionSelectMobile = this.onOptionSelectMobile.bind(this);
    }

    _onClick() {
        if (!this.isMobile) {
            const { open } = this.state;
            if (!open) {
                this.setState({
                    open: true
                });
            }
        }
    }

    componentDidMount() {
        const { defaultValue } = this.props;

        document.addEventListener('click', this.handleClickOutside, true);

        if (defaultValue !== null) {
            this.setState({ selectedValue: defaultValue });
        }
    }

    componentWillReceiveProps(props) {
        const { selectedValue } = this.state;
        if (selectedValue === null || selectedValue === "") {
            this.setState({ selectedValue: props.defaultValue });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside(event) {
        const domNode = ReactDOM.findDOMNode(this);

        if (!domNode || !domNode.contains(event.target)) {
            this.setState({
                open: false
            });
        }
    }

    onOptionSelect(value) {
        const { open } = this.state;
        const { onSelect } = this.props;

        this.setState({ selectedValue: value });
        if (open) {
            this.setState({ open: false });
        }

        onSelect(value);
    }

    onOptionSelectMobile(evt) {
        const value = evt.target.value;
        const { onSelect } = this.props;

        this.setState({ selectedValue: value });

        onSelect(value);
    }

    getSelectedValue() {
        const { options, defaultValue } = this.props;
        const { selectedValue } = this.state;

        if (!_.isEmpty(selectedValue)) {
            const option = _.find(options, { value: selectedValue });
            if (option !== undefined) {
                return option;
            }
        } else if (_.isEmpty(selectedValue) && !_.isEmpty(defaultValue)) {
            const option = _.find(options, { value: defaultValue });
            if (option !== undefined) {
                return option;
            }
        }

        return null;
    }

    addClassFunc() {
        if(this.state.focusClass == ''){
            this.setState({
                focusClass: ' focused'
            });
        } else {
            this.setState({
                focusClass: ''
            });
        }
    }

    mobile() {
        const { options, name, defaultValue, classes, label } = this.props;
        const { value, filled } = this.state;
        let value_2, is_focused = '';
        if(this.props.value) {
            value_2 = this.props.value;
        }
        const selectedValue = this.getSelectedValue();
        const selectStyle = {
            paddingLeft: 0,
            height: '3.2rem'
        };
        let items = options.map((option, index) => {
            return (
                <option key={index} value={option.value} className="material-field">{option.label}</option>
            );
        });


        if(value || value_2) {
            is_focused = ' has-value';
        }
        items = [<option disabled key={label} value={label}/>, ...items];

        return (
            <div className={"form-group-material " + this.state.focusClass + is_focused}>
                <select
                    id={name}
                    name={name}
                    className={"material-field " + classNames(classes, {
                        'filled': filled
                    })}
                    onFocus={() => this.addClassFunc(this)}
                    onBlurCapture={() => this.addClassFunc(this)}
                    value={this.state.selectedValue ? this.state.selectedValue : ''}
                    onChange={this.onOptionSelectMobile}
                    style={selectStyle}
                >
                    {items}
                </select>
                <label className="material-label" htmlFor={name}>{label}</label>
            </div>
        );
    }

    // desktop() {
    //     const { options, name } = this.props;
    //
    //     const items = options.map((option, index) => {
    //         return (
    //             <SelectOption
    //                 key={index}
    //                 index={index}
    //                 inputId={name}
    //                 value={option.value}
    //                 label={option.label}
    //                 selectedValue={this.state.selectedValue}
    //                 onSelect={this.onOptionSelect}
    //                 isMobile={false}
    //             />
    //         );
    //     });
    //
    //     return (
    //         <select name="classic" id="">
    //             {items}
    //         </select>
    //     );
    // }

    render() {
        const { name, label } = this.props;
        const selectedValue = this.getSelectedValue();

        let options = this.mobile();


        return (
            <div className="form-item__group">
                {options}
            </div>
        );
    }
}
Select.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        label: PropTypes.string
    })).isRequired,
    onSelect: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    defaultValue: PropTypes.string
};
Select.defaultProps = {
    defaultValue: null
};
