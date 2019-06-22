const express = require( 'express' );
const userRoutes = require( './user-routes.js' );
const mongoose = require( 'mongoose' );
const path = require( 'path' );
const cookie = require( 'cookie-parser' );
const jwt = require( 'jsonwebtoken' );

const app = express();

mongoose.connect( 'mongodb://127.0.0.1:27017/authentication-project', { useNewUrlParser: true, useCreateIndex: true }, ( error, client ) => {} );

app.set( 'view engine', 'hbs' );
app.set( 'views', path.join( __dirname, 'templates' ) );
app.use( express.static( path.join( __dirname, 'assets' ) ) );

// Able to read req.body
app.use( express.json() );

// Able to use cookie
app.use( cookie() );

// Middleware Authentication
app.use( ( req, res, next ) => {
    if ( '/login' !== req.path && ! req.cookies.hasOwnProperty( 'my-token' ) ) {
        return res.redirect( 'http://localhost:3000/login' );
    }
    else if ( '/login' === req.path && req.cookies.hasOwnProperty( 'my-token' ) ) {
        return res.redirect( 'http://localhost:3000/' );
    }

    next();
} );

app.get( '/', ( req, res ) => {
    var decoded = jwt.verify( req.cookies['my-token'], 'my-token-key' );

    res.render( 'index', {
        name: decoded.email
    } );
} );

app.use( userRoutes );

app.listen( 3000, () => {
    console.log( 'listening on port 3000' );
} );