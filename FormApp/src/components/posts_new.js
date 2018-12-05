import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createPost } from '../actions';

class PostsNew extends Component {
    
    renderField(field) {
        const {meta: {touched, error}} = field;
        const clsName = `form-group ${touched && error ? 'has-danger' : ''}`;
        return (
          <div className={clsName}>
              <label>{field.label}</label>
              <input
                  className="form-control"
                  type="text"
                  {...field.input}
              />
              <div className="text-help">
                {touched ? error : ''}
              </div>
          </div>
        );
    }

    onSubmit(values) {
        this.props.createPost(values, () => {
            this.props.history.push('/FormApp/');
        });
    }

    render() {
        const {handleSubmit} = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <Field
                    label="Title"
                    name="title"
                    component={this.renderField}
                />
                <Field
                    label="Categories"
                    name="categories"
                    component={this.renderField}
                />
                <Field
                    label="Content"
                    name="content"
                    component={this.renderField}
                />
                <button type="submit" className="btn btn-primary">Submit</button>
                
                <Link className="btn btn-danger" style={{marginLeft: '10px'}} to="/FormApp/">
                    Cancel
                </Link>
            </form>
        );
    }
}

function validate(values) {
    const errors = {};

    if (!values.title || values.title.length < 3) {
        errors.title = "Title needs to have min 3 char";
    }

    if (!values.categories || values.categories.length < 3) {
        errors.categories = "Enter a category.";
    }

    if (!values.content || values.content.length < 3) {
        errors.content = "Enter a content" +
            ".";
    }

    return errors;
}

export default reduxForm({
    validate,
    form: 'PostsNewForm'
})(
   connect (null, { createPost }) (PostsNew)
    );
