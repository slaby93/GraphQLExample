import React from 'react';
import ReactDom from 'react-dom';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import  '../node_modules/graphiql/graphiql.css';
import  './index.scss';

class A extends React.PureComponent{
    render(){
        return (
            <div>
                <span>TEST</span>
            </div>
        );
    }
}


function graphQLFetcher(graphQLParams) {
    console.log('FETCJER',graphQLParams)
    return fetch('http://localhost:3000/graphql', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
}




ReactDom.render(<GraphiQL fetcher={graphQLFetcher} />,document.getElementById('app'));