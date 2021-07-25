import React, { Component } from 'react';
import { userLogin } from "../../services/authentication"
import {user_login } from "../../services/appstore/actions/actions"
import { LoginForm } from "../forms"
import {connect } from "react-redux"
import { Container } from "reactstrap"

class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {error: "", formLoading: false}
    }
    handleSubmit = async (value) => {
        const { user_login} = this.props
        this.setState({
            formLoading: true
        })
        try {
            await userLogin(value, user_login)
            this.setState({
                error: ""
            })
        this.setState({
            formLoading: false
        })
        } catch (error) {
            this.setState({error: error.response.data.message || "An error occured", formLoading: false})
        }
    }
    render() {
        const { formLoading } = this.state
        console.log(this.props)
        return(
            <div style={{ background: "black" }}>
                {!!this.state.error && <p style={{color: 'red'}}>{this.state.error}</p>}
                {LoginForm(this.handleSubmit, formLoading)}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isSignedIn: state.user.signIn.isSignedIn,})
export default connect(mapStateToProps, {user_login})(HomePage);