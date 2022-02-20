import React from 'react'
import Image from 'next/image'

import Button from '@mui/material/Button';

import background from '../assets/background.jpeg'

const style = {
    wrapper: `w-screen h-screen bg-[url("../assets/backgroundWaveBlack.svg")] bg-cover grid place-items-center`,
    panelContainer: `flex flex-row w-3/5 h-3/5 justify-between items-center`,
    panel1: `w-2/5 h-4/5 bg-[#e8e8e8] p-10 rounded-2xl text-center shadow flex flex-col justify-center items-center`,
    panel2: `w-2/5 h-4/5 bg-[#1c1c1c] p-10 rounded-2xl text-center shadow flex flex-col justify-center items-center`,
    panel1Title: `text-[#1c1c1c] text-4xl font-light basis-1/4 grid place-items-center`,
    panel2Title: `text-white text-4xl font-light basis-1/4 grid place-items-center`,
    panel1Description: `text-[#1c1c1c] basis-1/2 grid place-items-center`,
    panel2Description: `text-white basis-1/2 grid place-items-center`,
    panel1Button: `text-[#1c1c1c] basis-1/4 grid place-items-center`,
    panel2Button: `text-white basis-1/4 grid place-items-center`
}

const Hero = () => {
    return (
        <div className={style.wrapper}>
            <div className={style.panelContainer}>
                <div className={style.panel1}>
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
                </div>
                <div className={style.panel2}>
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
                </div>
            </div>
        </div>
    )
}

export default Hero