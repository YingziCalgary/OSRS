import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // Example middleware import
import rootReducer from './reducers'; // Import your root reducer


const {createStore} = Redux;

const initState = {
    todos:[],
    posts:[]
}

function myReducer (state = initState, action) {
    if(action.type == 'Add_TODO') {
        return {...state, todos: [...state.todos, action.todo]}
    }
    if(action.type == 'Add_POST') {
        return {...state, posts: [...state.posts, action.post]}
    }
}

const store = createStore(myReducer);

store.subscribe(()=> {
    console.log('state updated');
    console.log(store.getState());
})

store.dispatch({type: 'Add_TODO', todo: 'buy milk'});
store.dispatch({type: 'Add_TODO', todo: 'sleep'});
store.dispatch({type: 'Add_POST', post: 'Learn Java'});


// in react app
const mapStateToProps = (state, ownProps) => {
    let id = ownProps.match.params.post_id;
    return {
        post: state.posts.find(post=>post.is == id)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        deletePost: (id)=>{dispatch(deletePost(id))}
    }
}

export default connect (mapStateToProps, mapDispatchToProps)(Post)


export const deletePost = (id) => {
    return {
        type: 'DELE_POST',
        id: id
    }
}
  
