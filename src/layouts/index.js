import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Provider } from 'rebass';
import { injectGlobal } from 'styled-components'

injectGlobal`
  * { box-sizing: border-box; }
  body { margin: 0; }
`;

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
      title="Do Normal"
      meta={[
        { name: 'description', content: 'Do Normal' },
        { name: 'keywords', content: '' },
      ]}
    />
    <Provider theme={{
      colors: {
        pinkHippie: '#ab4e67',
        redCadillac: '#98445a',
        yellowCasablanca: '#f5b74c',
        blueRegentSt: '#96c7d7',
        greenGossip: '#a7d796',
        greyMortar: '#5a5959',
        greyShadyLady: '#9b9697'
      }
    }}>
      {children()}
    </Provider>
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
