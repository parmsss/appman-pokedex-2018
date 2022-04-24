import React, { Component, useEffect, useState } from 'react'
import './App.css'
import PokemonList from './pokemonList'
import { Layout, Col, Row, Modal, Button, Input, Rate } from 'antd';
import 'antd/dist/antd.css'
import Cute from './cute.png'
import Search from './search.png';
import ProgressBar from "@ramonak/react-progress-bar";
import axios from 'axios';

const { Header, Content, Footer, Sider } = Layout;


const Pokedex = () => {

    const [myPokemon, setMyPokemon] = useState([])
    const [id, setId] = useState()

    const onRemove = (id) => {
        console.log('id', id);
        let _myPokemon = myPokemon.filter((pokemon) => pokemon.nationalPokedexNumber != id)
        setMyPokemon(_myPokemon)
    }

    const ModalPokemon = (props) => {

        const { Search } = Input
        const [pokeList, setPokeList] = useState()
        const [isModalVisible, setIsModalVisible] = useState(false)
        const [_pokemon, set_pokemon] = useState([])

        console.log('props', myPokemon);

        const showModal = () => {
            setIsModalVisible(true);
        }

        const handleOk = () => {
            setIsModalVisible(false);
        };

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

        const onAdd = (pokemon) => {
            console.log('pokemon', pokemon);

            let _pokemon = myPokemon.concat(pokemon)
            setMyPokemon(_pokemon)

        }

        const onSearch = (param) => {
            axios.get(`http://localhost:3030/api/cards?limit=30&name=${param}`).then((response) => {
                console.log('search', response);
                setPokeList(response.data.cards)
            })
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
            const _damadge = damadge?.map((dmg) => {return _dmg =_dmg + parseInt(dmg.damage.replaceAll('+').replaceAll('-').replaceAll('*').replaceAll('/'))})
            _dmg =_damadge?.reduce((total, dmg) => total = total+ dmg)
            // if (_dmg != NaN) {
            //     console.log('happy', hp, weaknesses, _dmg);

            // }

            let happiness = (((hp >= 0 ? hp > 100 ? 100 : hp : 0)/10) + ((_dmg >= 0 ? _dmg : 0)/10)+ 10 - weaknesses) / 5
            console.log('happ', happiness, ((hp >= 0 ? hp > 100 ? 100 : hp : 0)/10), ((_dmg >= 0 ? _dmg : 0)/10), weaknesses );

             let _happiness = happiness < 0 ? happiness*(-1) : happiness
             
             return _happiness > 5 ? 5 : _happiness

        }

        return (
            <>
                <Button className='font' shape="circle" size='large' onClick={showModal}>+</Button>
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
                <Modal visible={isModalVisible} onOk={handleOk} width={750} bodyStyle={{ height: 600, overflow: 'auto' }} closable={false}>
                    <Search
                        placeholder="input search text"
                        enterButton style={{ borderRadius: 5 }}
                        suffix={<img src={Search} />}
                        onSearch={(value) => {
                            console.log('eieiei', value)
                            onSearch(value)
                        }}
                    />
                    {pokeList?.map((pokemon) => {
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
                                <img className='img' src={pokemon?.imageUrl} />
                            </Col>
                            <Col span={15}>
                                <Row className='mt-2'>
                                    <Col>
                                        <div className='font-pokemon' >
                                            {pokemon?.name}
                                        </div>
                                    </Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col span={12}>
                                        <div className='font'>Hp: {<ProgressBar completed={parseInt(pokemon?.hp) > 100 ? 100 : parseInt(pokemon?.hp)} customLabel=" " bgColor='#f3701a ' height='15px' />}</div>
                                    </Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col span={12}>
                                        <div className='font'>STR: {<ProgressBar completed={pokemon?.attacks?.length ? countAtk(pokemon?.attacks?.length) : 0} customLabel=" " bgColor='#f3701a' height='15px' />}</div>
                                    </Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col span={12}>
                                        <div className='font'>WEAK: {<ProgressBar completed={pokemon?.weaknesses?.length ? 100 : 0} customLabel=" " bgColor='#f3701a' height='15px' />}</div>
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
                            <Col span={1} className='mt-2'>
                                <Button key={`${pokemon.name}`} className='font-add' type="text" onClick={(e) => { onAdd(pokemon) }} >add</Button>
                            </Col>
                        </Row>
                    })
                    }
                </Modal>
                {/* </Content> */}
                {/* </Sider> */}
                {/* </Layout> */}
            </>
        )


    }

    return (
        <>
            <Layout>
                {/* <div>
            My Pokedex */}
                <Header className='header' style={{ background: '#f0f2f5' }}>My Pokedex</Header>
                <Content style={{ width: '1024 px', maxHeight: '540px', height: '540px', overflow: 'auto', margin: '24px 16px 0' }}>
                    <PokemonList data={myPokemon} onRemove={onRemove} />
                </Content>
                <Footer style={{ background: '#ec5656', textAlign: 'center' }}><ModalPokemon /></Footer>
                {/* </div> */}
            </Layout>
        </>
    )

}


export default Pokedex