import { Card, Layout, Col, Row, Rate, Modal, Button } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import ProgressBar from "@ramonak/react-progress-bar";
import Cute from './cute.png'

const { Header, Content, Footer, Sider } = Layout;

const PokemonList = (props) => {

    const [pokeList, setPokeList] = useState()

    useEffect(() => {

        axios.get('http://localhost:3030/api/cards').then((response) => {
            console.log('response', response);
            setPokeList(response.data.cards)
        })

    }, [])

    const countAtk = (atk) => {
        switch (atk) {
            case 1:
                return 50
                break;
            case 2:
                return 100
                break;
            default:
                return 0
                break;
        }
    }

    const customIcons = {
        1: <img className='img-cute' src={Cute} />,
        2: <img className='img-cute' src={Cute} />,
        3: <img className='img-cute' src={Cute} />,
        4: <img className='img-cute' src={Cute} />,
        5: <img className='img-cute' src={Cute} />,
    }

    const happinesses = (hp, damadge, weaknesses) => {
        let _dmg = 0
        const _damadge = damadge?.map((dmg) => { return _dmg = _dmg + parseInt(dmg.damage.replaceAll('+').replaceAll('-').replaceAll('*').replaceAll('/')) })
        _dmg = _damadge?.reduce((total, dmg) => total = total + dmg)
        // if (_dmg != NaN) {
        //     console.log('happy', hp, weaknesses, _dmg);

        // }

        let happiness = (((hp >= 0 ? hp > 100 ? 100 : hp : 0) / 10) + ((_dmg >= 0 ? _dmg : 0) / 10) + 10 - weaknesses) / 5
        console.log('happ', happiness, ((hp >= 0 ? hp > 100 ? 100 : hp : 0) / 10), ((_dmg >= 0 ? _dmg : 0) / 10), weaknesses);

        let _happiness = happiness < 0 ? happiness * (-1) : happiness

        return _happiness > 5 ? 5 : _happiness
    }

    console.log('pokedata', pokeList);

    return (
        <>
            {/* <Layout hasSider> */}
            {/* <Sider
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        width: '1024 px'
                        // left: 0,
                        // top: 0,
                        // bottom: 0,
                    }}
                > */}
            {/* <Content style={{ width: '1024 px', height: '85vh', overflow: 'initial', margin: '24px 16px 0' }}> */}
            {props.data?.map((pokemon) => {
                // return <Card
                //     // cover={
                //     //     <img src={pokemon.imageUrl} />
                //     // }
                //     // hoverable
                //     // style={{ width: '900 px' }}
                // >
                //     <Layout hasSider>
                //         <Sider><img src={pokemon.imageUrl} /></Sider>
                //         <Content>eiei</Content>
                //     </Layout>
                // </Card>
                // return <Layout hasSider>
                //     <Sider><img src={pokemon.imageUrl} /></Sider>
                //     <Content>eiei</Content>
                // </Layout>
                return <Row className={'card-pokemon'}>
                    <Col span={7} className='card-body'>
                        <img className='img' src={pokemon.imageUrl} />
                    </Col>
                    <Col span={15}>
                        <Row className='mt-2'>
                            <Col>
                                <div className='font-pokemon' >
                                    {pokemon.name}
                                </div>
                            </Col>
                        </Row>
                        <Row className='mt-2'>
                            <Col span={12}>
                                <div className='font'>Hp: {<ProgressBar completed={parseInt(pokemon.hp) > 100 ? 100 : parseInt(pokemon.hp)} customLabel=" " bgColor='#f3701a ' height='15px' />}</div>
                            </Col>
                        </Row>
                        <Row className='mt-2'>
                            <Col span={12}>
                                <div className='font'>STR: {<ProgressBar completed={pokemon.attacks?.length ? countAtk(pokemon.attacks.length) : 0} customLabel=" " bgColor='#f3701a' height='15px' />}</div>
                            </Col>
                        </Row>
                        <Row className='mt-2'>
                            <Col span={12}>
                                <div className='font'>WEAK: {<ProgressBar completed={pokemon.weaknesses?.length ? 100 : 0} customLabel=" " bgColor='#f3701a' height='15px' />}</div>
                            </Col>
                        </Row>
                        <Row className='mt-2' style={{ width: '10 px', height: '10 px' }}>
                            <Col span={12}>
                                <div>
                                    <Rate disabled count={happinesses(parseInt(pokemon.hp) > 100 ? 100 : parseInt(pokemon.hp), pokemon.attacks, pokemon.weaknesses?.length ? 100 : 0)} character={({ index }) => customIcons[index + 1]} />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={1}>
                        <Button className='font-add' type="text" onClick={(e) => props.onRemove(pokemon.nationalPokedexNumber)} >X</Button>
                    </Col>
                </Row>
            })
            }
            {/* </Content> */}
            {/* </Sider> */}
            {/* </Layout> */}
        </>
    )


}

export default PokemonList