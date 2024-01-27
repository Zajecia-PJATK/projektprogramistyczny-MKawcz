// Loader.js
import React from 'react';
import '../styles/utils/_loading_animation.scss';

const Loader = () => (
    <div className="loader">
        <img src={require('../filmFolio.png')} alt="Loading..." className="spinner" />
    </div>
);

export default Loader;
