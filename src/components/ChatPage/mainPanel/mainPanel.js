import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";

class MainPanel extends Component {
    render() {
        return (
            <div>
                <MessageHeader />

                <div style={{
                    width: '100%',
                    height: '450px',
                    border: '.2rem solid #868e96',
                    borderRadius: '4px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    overflowY: 'auto',
                }} >

                </div>
                <MessageForm />

            </div>
        );
    }
}

MainPanel.propTypes = {};

export default MainPanel;
