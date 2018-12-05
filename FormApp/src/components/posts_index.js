import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts} from "../actions";
import { deletePost} from "../actions";
import _ from 'lodash';

class PostIndex extends Component {

    componentDidMount(){
        this.props.fetchPosts();
    }

    renderPosts() {
       return _.map(this.props.posts, post => {
           return (
             <li className="list-group-item" key={post.id} style={{height:"60px"}}>
                 {post.title}
                 <div  style={{float:"right"}}>
                    <Link className="btn btn-warning" to={`/FormApp/posts/${post.id}`}>
                        Details
                    </Link>
                    <button className="btn btn-danger" onClick={(ev) => {
                        this.props.deletePost(post.id);
                    }}
                        style={{marginLeft: "5px"}}>
                        Delete
                    </button>
                 </div>
                 
             </li>
           );
       });
    }

    render () {
        return (
          <div>
              <div className="text-xs-right">
                  <Link className="btn btn-primary" to="/FormApp/posts/new">
                    Add a Post..
                  </Link>
              </div>
              <h3>Posts</h3>
              <ul className="list-group">
                  {this.renderPosts()}
              </ul>
          </div>
        );
    }
}

function mapStateToProps(state) {
    return {posts: state.posts};
}

export default connect(mapStateToProps, { fetchPosts, deletePost })(PostIndex);
