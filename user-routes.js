const express = require( 'express' );
const bcrypt = require( 'bcrypt' );
const User = require( './user-model.js' );
const route = express.Router();
const jwt = require( 'jsonwebtoken' );

route.get( '/login', async ( req, res ) => {
    try {
        res.render( 'login' );
    }
    catch ( e ) {
        res.status( 500 ).send( e );
    }    
} );

route.post( '/login', async ( req, res ) => {
    var user = await User.findOne( { email: req.body.email } );

    if ( ! user ) {
        return res.send( { errorMessage: 'Email is not existed' } );
    }

    var isMatch = await bcrypt.compare( req.body.password, user.password );

    if ( ! isMatch ) {
        return res.send( { errorMessage: 'Password is invalid' } );
    }

    var token = await jwt.sign( { 
        _id: user._id.toString(),
        email: user.email
    }, 'my-token-key' );

    res.cookie( 'my-token', token, { maxAge: 10000, httpOnly: true } );

    res.send( { url: 'http://localhost:3000' } );
} );

module.exports = route;