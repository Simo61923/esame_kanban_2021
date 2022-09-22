import React from 'react';
import { Link } from 'react-router-dom';


class ErrorPage extends React.Component {

    constructor(props) {
        super(props);
    }


    render(){
        return <div>
            <div style={{textAlign:"center",fontSize: "xx-large"}}>Internal Server Error</div>
            <p style={{textAlign:"center"}}>
              <Link to="/">Go to Home </Link>
            </p>
          </div>;
    }
}

export default ErrorPage;