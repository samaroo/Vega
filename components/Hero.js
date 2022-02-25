import React from 'react'
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { useTransition, useSpring, animated, config } from 'react-spring'
import { useWeb3 } from '@3rdweb/hooks'
import { client } from '../lib/sanityClient'
import toast, { Toaster } from 'react-hot-toast'

const style = {
    wrapper: `w-screen h-screen bg-[url("../assets/blackWave.png")] bg-cover grid place-items-center`,
    loginPanelContainer: `grid place-items-center absolute top-0 right-0 bottom-0 left-0`,
    panelContainer: `flex flex-row w-3/5 h-3/5 justify-between items-center`,
    loginPanel: `w-3/12 h-2/6 bg-[#1c1c1c] p-10 rounded-2xl text-center shadow flex flex-col justify-around items-center`,
    panel1: `w-2/5 h-4/5 bg-[#e8e8e8] p-10 rounded-2xl text-center shadow flex flex-col justify-around items-center`,
    panel2: `w-2/5 h-4/5 bg-[#1c1c1c] p-10 rounded-2xl text-center shadow flex flex-col justify-around items-center`,
    panel1Title: `text-[#1c1c1c] text-4xl font-light basis-1/4 grid place-items-center`,
    panel2Title: `text-white text-4xl font-light basis-1/4 grid place-items-center`,
    loginPanelTitle: ``,
    panel1Description: `text-[#1c1c1c] basis-1/2 grid place-items-center`,
    panel2Description: `text-white basis-1/2 grid place-items-center`,
    panel1Button: `text-[#1c1c1c] basis-1/4 grid place-items-center`,
    panel2Button: `text-white basis-1/4 grid place-items-center`
}

const Hero = () => {

    const { address, connectWallet } = useWeb3()

    const confirmLoggedIn = (toastHandler = toast) => {
        toastHandler.success(
            "Successfully Logged In!",
            {
                style: {
                    background: '#1c1c1c',
                    color: 'white'
                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#1c1c1c',
                }
            }
        )
    }

    useEffect(() => {
        if (!address) { return; }
        ;(async () => {
            const userDoc = {
                _type: 'users',
                _id: address,
                userName: 'Unnamed',
                walletAddress: address
            }

            const result = await client.createIfNotExists(userDoc)
            confirmLoggedIn()
        })()
    }, [address])

    const transitionLogInPanel = useTransition(!address, {
        from: {x: 0, y: 200, opacity: 0},
        enter: {x: 0, y: 0, opacity: 1, delay: 200},
        leave: {x: 0, y: -200, opacity: 0},
        config: config.slow
    })
    const transitionPanel1 = useTransition(address, {
        from: {x: 0, y: 200, opacity: 0},
        enter: {x: 0, y: 0, opacity: 1, delay: 600},
        config: config.slow
    })
    const transitionPanel2 = useTransition(address, {
        from: {x: 0, y: 200, opacity: 0},
        enter: {x: 0, y: 0, opacity: 1, delay: 700},
        config: config.slow
    })
    const calc = (x, y) => [-(y - window.innerHeight / 2) / 50, (x - window.innerWidth / 2) / 50, 1];
    const trans = (x, y, s) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

    const [panel1Props, setPanel1Props] = useSpring(() => ({
        xys: [0, 0, 1],
        config: { mass: 5, tension: 350, friction: 40 }
    }));

    const [panel2Props, setPanel2Props] = useSpring(() => ({
        xys: [0, 0, 1],
        config: { mass: 5, tension: 350, friction: 40 }
    }));

    const renderLogInPanel = () => {
        return (
            <div className={style.loginPanelContainer}>
                {transitionLogInPanel((styles, item) => {
                    if (item) { return (
                        <animated.div style={styles} className={style.loginPanel}>
                            <div className={style.panel2Title}>
                                Connect Your Favorite Wallet
                            </div>
                            <div className={style.panel2Button}>
                                <Button 
                                    variant="contained"
                                    size="large"
                                    style={{backgroundColor: 'white', color: '#1c1c1c'}}
                                    onClick={() => connectWallet('injected')}
                                >
                                    Link
                                </Button>
                            </div>
                        </animated.div>
                    )}
                })}
            </div>
        )
    }

    const renderMainPanel = (isLoggedIn) => {
        return !isLoggedIn ? "" : (
            <div className={style.panelContainer}>
                {transitionPanel1((styles, item) => {
                    if (item) { return (
                        <animated.div 
                            onMouseMove={({ clientX: x, clientY: y }) => setPanel1Props({ xys: calc(x, y) })}
                            onMouseLeave={() => setPanel1Props({ xys: [0, 0, 1] })}
                            style={{ transform: panel1Props.xys.interpolate(trans), ...styles }} 
                            className={style.panel1}
                        >
                            <div className={style.panel1Title}>
                                Explore
                            </div>
                            <div className={style.panel1Description}>
                                Browse the wide variety of NFT collections available on Vega wether you are looking for inspiration or to purchase a piece for yourself!
                            </div>
                            <div className={style.panel1Button}>
                                <Button variant="contained" size="large" style={{backgroundColor: '#1c1c1c'}}>
                                    Let's Explore
                                </Button>
                            </div>
                        </animated.div>
                    )}
                })}
                {transitionPanel2((styles, item) => {
                    if (item) { return (
                        <animated.div 
                            onMouseMove={({ clientX: x, clientY: y }) => setPanel2Props({ xys: calc(x, y) })}
                            onMouseLeave={() => setPanel2Props({ xys: [0, 0, 1] })}
                            style={{ transform: panel2Props.xys.interpolate(trans), ...styles }} 
                            className={style.panel2}
                        >
                            <div className={style.panel2Title}>
                                Create
                            </div>
                            <div className={style.panel2Description}>
                                Share your art with the world! With Vega, you can mint, promote, and sell your very own NFT collection in just a few clicks!
                            </div>
                            <div className={style.panel2Button}>
                                <Button variant="contained" size="large" style={{backgroundColor: 'white', color: '#1c1c1c'}}>
                                    Let's Create
                                </Button>
                            </div>
                        </animated.div>
                    )}
                })}
            </div>
        )
    }

    return (
        <div className={style.wrapper}>
            <Toaster position='bottom-left' reverseOrder={false}/>
            {renderLogInPanel()}
            {renderMainPanel(address)}
        </div>
    )
}

export default Hero