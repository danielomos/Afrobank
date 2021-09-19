import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { transactionHistory, getBalance } from '../../services/transactions'
import { Container, Col, Row, Table } from 'reactstrap'
import {
    updateTransactionHistory,
    toggleDisplay,
} from '../../services/appstore/actions/actions'
import {
    getFormatedDate,
    calculateAllDebit,
    formatMoney,
    getFormatedTime,
    getTimeOfTheDay,
} from '../../utils'
import {
    Autorenew,
    Search,
    Visibility,
    VisibilityOff,
} from '@material-ui/icons'
import styled from 'styled-components'
import Loader from 'react-loader-spinner'

const AccountCard = styled.div`
    height: 150px;
    width: 100%;
    border-radius: 10px;
    background: #0d3153;
    background-image: url(${(props) => props.img});
    transition: all ease 0.3s;
`

export const Dashbody = styled.div`
    height: 105vh;
    background: #0f0f0fe5;
`
const Inputdiv = styled.div`
    width: 230px;
    background: #0f0f0f73;
    height: 44px;
    padding-right: 10px;
    padding-left: 10px;
    border-radius: 5px;
`
const Input = styled.input`
    border: none;
    outline: none;
    height: 100%;
    background: transparent;
    color: white;
`
const DashbodyCard = styled.div`
    width: 100%;
    background: #000000;
    border-radius: 10px;
    height: 100%;
    max-height: 530px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`

export const Type = styled.span`
    color: ${(props) => props.color};
    font-size: ${(props) => props.size}px;
`

const Dashboard = (props) => {
    const [state, setState] = useState({
        toggleTransferModal: false,
        balance: 0,
        displayBal: true,
        balanceLoading: false,
    })
    const data = useSelector((state) => state.user)

    const style = {
        cursor: 'pointer',
    }

    const pageBalance = async () => {
        const { accountNumber } = data.signIn.payLoad
        setState({
            balanceLoading: true,
        })
        try {
            const balance = await getBalance(accountNumber)
            await transactionHistory(
                accountNumber,
                props.updateTransactionHistory
            )
            setState({
                balance: balance,
                balanceLoading: false,
            })
        } catch (error) {
            setState({
                balanceLoading: false,
            })
            throw error
        }
    }

    const toggleVisibility = () => {
        setState({ ...state, displayBal: !state.displayBal })
        props.toggleDisplay(state.displayBal)
    }

    const renderTransactions = () => {
        const { transactions } = data
        return transactions.slice(0, 4).map((transaction, i) => {
            const {
                transaction_id,
                amount,
                transaction_date,
                transaction_type,
            } = transaction

            const formatDay = getFormatedDate(transaction_date)
            const formatTime = getFormatedTime(transaction_date)
            return (
                <tr key={i}>
                    <td>{transaction_id}</td>
                    <td
                        style={{
                            color: `${
                                transaction_type === 'credit' ? 'green' : 'red'
                            }`,
                            fontWeight: 600,
                        }}
                    >
                        {formatMoney(amount)}
                    </td>
                    <td
                        style={{
                            color: `${
                                transaction_type === 'credit' ? 'green' : 'red'
                            }`,
                            fontWeight: 600,
                        }}
                    >
                        {transaction_type}
                    </td>
                    <td>{`${formatDay} ${formatTime}`}</td>
                </tr>
            )
        })
    }

    useEffect(() => {
        async function fetchData() {
            const { accountNumber } = data.signIn.payLoad
            setState({
                balanceLoading: true,
            })
            try {
                await transactionHistory(
                    accountNumber,
                    props.updateTransactionHistory
                )
                const balance = await getBalance(accountNumber)
                setState({
                    balance: balance,
                    balanceLoading: false,
                })
            } catch (error) {
                throw error
            }
        }
        fetchData()
    }, [data.signIn.payLoad, props.updateTransactionHistory])

    return (
        <Col>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between pt-4 align-items-center">
                        <Type
                            size="25"
                            className="font-weight-bold"
                            color="white"
                        >
                            {`Hello ${
                                data.signIn.payLoad.firstName
                            }, ${getTimeOfTheDay()}.`}
                        </Type>
                        <Inputdiv className="d-flex justify-content-between align-items-center">
                            <Search />
                            <Input placeholder="Find something" />
                        </Inputdiv>
                    </div>
                    <DashbodyCard className="pb-3 pt-3 mt-5">
                        <Container className="pr-4 pl-4">
                            <Row className="pt-3">
                                <Col lg={4}>
                                    <AccountCard
                                        style={{
                                            background: '#4004af',
                                            color: 'white',
                                        }}
                                    >
                                        <Container>
                                            <div className="d-flex justify-content-end pt-2 align-items-center">
                                                <Autorenew
                                                    style={style}
                                                    onClick={() =>
                                                        pageBalance()
                                                    }
                                                />
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                {props.balanceDisplay ? (
                                                    <Visibility
                                                        onClick={() =>
                                                            toggleVisibility()
                                                        }
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            top: '70%',
                                                        }}
                                                    />
                                                ) : (
                                                    <VisibilityOff
                                                        onClick={() =>
                                                            toggleVisibility()
                                                        }
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            top: '70%',
                                                        }}
                                                    />
                                                )}

                                                <Type
                                                    size="24"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '65%',
                                                        right: '10%',
                                                        fontWeight: 600,
                                                        color: `${
                                                            state.balance < 100
                                                                ? 'red'
                                                                : 'white'
                                                        }`,
                                                    }}
                                                >
                                                    {state.balanceLoading ? (
                                                        <Loader
                                                            type="ThreeDots"
                                                            height={30}
                                                            width={30}
                                                            color="#ffff"
                                                        />
                                                    ) : !props.balanceDisplay ? (
                                                        formatMoney(
                                                            state.balance
                                                        )
                                                    ) : (
                                                        '****'
                                                    )}
                                                </Type>
                                            </div>
                                        </Container>
                                    </AccountCard>
                                </Col>
                                <Col lg={4}>
                                    <AccountCard
                                        style={{
                                            background: '#f707eb',
                                            color: 'white',
                                        }}
                                        className="pt-2"
                                    >
                                        <Container>
                                            <Type
                                                size="15"
                                                className="mt-5 font-weight-bold"
                                            >
                                                Account Details
                                            </Type>
                                            <br />
                                            <Type
                                                size="12"
                                                style={{
                                                    position: 'absolute',
                                                    top: '60%',
                                                    fontWeight: 550,
                                                }}
                                            >
                                                Name:{' '}
                                                {`${data.signIn.payLoad.firstName} ${data.signIn.payLoad.lastName}`}
                                            </Type>
                                            <br />
                                            <Type
                                                size="15"
                                                style={{
                                                    position: 'absolute',
                                                    top: '75%',
                                                    fontWeight: 550,
                                                }}
                                            >
                                                Account Number:
                                                {
                                                    data.signIn.payLoad
                                                        .accountNumber
                                                }
                                            </Type>
                                        </Container>
                                    </AccountCard>
                                </Col>
                                <Col lg={4}>
                                    <AccountCard className="d-flex justify-content-center align-items-center">
                                        <Type color="white">{`you've spent ${calculateAllDebit(
                                            data.transactions
                                        )} so far`}</Type>
                                    </AccountCard>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-between pt-4">
                                <Type size="18" color="white">
                                    Transactions
                                </Type>
                                <Type color="green">Show all</Type>
                            </div>
                            <div className="pt-3">
                                <Table
                                    style={{ overflowY: 'scroll' }}
                                    striped
                                    responsive
                                    borderless
                                >
                                    <thead style={{ color: 'whitesmoke' }}>
                                        <tr>
                                            <th>Transaction ID</th>
                                            <th>Amount</th>
                                            <th>Type</th>
                                            <th>Date/Time</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ color: 'white' }}>
                                        {!!data.transactions &&
                                            renderTransactions()}
                                    </tbody>
                                </Table>
                            </div>
                        </Container>
                    </DashbodyCard>
                </Col>
            </Row>
        </Col>
    )
}

const mapStateToProps = (state) => ({
    balanceDisplay: state.user.balanceDisplay,
})
export default connect(mapStateToProps, {
    updateTransactionHistory,
    toggleDisplay,
})(Dashboard)