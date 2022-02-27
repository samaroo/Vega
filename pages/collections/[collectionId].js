import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import { useTransition, useSpring, animated, config, useSpringRef, useChain, easings } from 'react-spring'
import { useRouter } from 'next/router'
import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from "@3rdweb/sdk";
import { client } from '../../lib/sanityClient'
import Header from '../../components/Header'
import { BsArrowDownCircleFill, BsPersonCircle, BsInfoCircle } from 'react-icons/bs'
import { AiOutlineDollarCircle } from 'react-icons/ai'
import { BiArrowFromBottom } from 'react-icons/bi'
import { FaEthereum } from 'react-icons/fa'

const style = {
    defaultWrapper: `w-screen h-screen bg-cover bg-[url("../assets/greySwirl.jpg")] grid place-items-center`,
    parallax1Background: { backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black', fontSize: '3rem', fontWeight: 'bold' },
    parallax2Backgorund: { backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '3rem', fontWeight: 'bold' },
    profileImageParallexLayer: { display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'none' },
    collectionTitleParallexLayer: { textAlign: 'center', background: 'none' },
    chevronParallexLayer: { display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'none' },
    profileImage: 'w-[200px] h-[200px] shadow-dark rounded-full border-solid border-4 border-white',
    collectionTitle: 'text-black text-6xl pb-[300] font-custom font-bold',
    chevronContainer: `text-6xl font-bold`,
    aboutContainer: 'flex flex-row justify-between items-center h-3/4 w-3/4',
    aboutLeftConatiner: `flex flex-col justify-between items-center w-full p-6 h-full`,
    aboutRightConatiner: `flex flex-col justify-between items-center w-full p-6 h-full`,
    creatorPanel: `bg-white w-full m-4 h-full rounded-2xl overflow-hidden relative border-4 border-white flex flex-row justify-start items-center`,
    floorPricePanel: `bg-white w-full m-4 h-full rounded-2xl overflow-hidden relative border-4 border-white flex flex-row justify-start items-center`,
    volumeTradedPanel: `bg-white w-full m-4 h-full rounded-2xl overflow-hidden relative border-4 border-white flex flex-row justify-start items-center`,
    aboutPanel: `bg-white basis-3/4 m-4 w-full rounded-2xl overflow-hidden relative border-4 border-white flex flex-col justify-start items-center`,
    titlePanel: `bg-white basis-1/4 m-4 p-2 w-full rounded-2xl overflow-hidden relative border-4 border-white flex flex-row justify-start items-center`,
    circle: `origin-center absolute top-[50%] -left-[90px] w-[200px] h-[200px] -translate-y-[50%] rounded-full bg-black shadow-dark`,
    aboutPanelCircle: `origin-center absolute -top-[70px] -left-[70px] w-[200px] h-[200px] rounded-full bg-black shadow-dark`,
    iconInCircle: `text-white text-5xl z-10 w-[100px] grid place-items-center`,
    circleCardBodyContainer: `text-black flex flex-col justify-start items-center grow w-full h-full`,
    circleCardTitle: `text-black text-xl mt-2 mb-6 font-normal`,
    circleCardMainContentContainer: `text-5xl flex flex-row justify-start items-center`,
    creatorCardMainContentContainer: `text-4xl flex flex-row justify-start items-center`,
    ethIcon: `text-4xl`,
    titlePanelImageContainer: `basis-1/4 p-2 grid place-items-center`,
    titlePanelMainContentContainer: `basis-3/4 p-2 grid place-items-center text-black text-3xl`,
    aboutPanelIcon: `absolute top-[30px] left-[30px] text-5xl text-white z-10`,
    aboutPanelTitle: `h-[130px] w-full grid place-items-center text-3xl text-black mb-4 font-normal`,
    aboutPanelMainContent: `grow text-4xl text-black p-10 text-center`
}

const Collection = () => {

    const alchemyAPIKey = "https://eth-rinkeby.alchemyapi.io/v2/xipjRXZItmW5MQkrkUeRpf_1p_wVqrFj"
    const marketplaceId = "0xF9726D94B999024a85C9827F5A4BAddB62E03C33"
    const router = useRouter()
    const { collectionId } = router.query
    const { provider } = useWeb3()
    const [collection, setCollection] = useState({})
    const [nfts, setNfts] = useState([])
    const [listings, setListings] = useState([])
    const ref = useRef()

    //fetch NFT Module from ThirdWeb when ThirdWeb Provider is available
    const nftModule = useMemo(() => {
        if (!provider) return

        const sdk = new ThirdwebSDK(
            provider.getSigner(),
            alchemyAPIKey
        )
        return sdk.getNFTModule(collectionId)
    }, [provider])

    //fetch NFT Marketplace Module from ThirdWeb when the ThirdWeb Provider is available
    const marketplaceModule = useMemo(() => {
        if (!provider) return

        const sdk = new ThirdwebSDK(
            provider.getSigner(),
            alchemyAPIKey
        )
        return sdk.getMarketplaceModule(marketplaceId)
    }, [provider])

    //fetch all NFTs in the collection: {collectionId}, when the ThirdWeb NFT Module is available
    useEffect(() => {
        if (!nftModule) return

        ;(async () => {
            const nfts = await nftModule.getAll()
            setNfts(nfts)
        })()
    }, [nftModule])

    //fetch all listings from Thirdweb Marketplace when the Thirdweb Marketplace Module is available
    useEffect(() => {
        if (!marketplaceModule) return

        ;(async () => {
            const listings = await marketplaceModule.getAllListings()
            setListings(listings)
        })()
    }, [marketplaceModule])

    //fetch the data of a collection from the sanity database
    const fetchCollectionData = async (collectionId, sanityClient = client) => {
        const marketItemQuery = `
            *[_type == 'marketItems'&& contractAddress == '${collectionId}']{
                "profileImageUrl": profileImage.asset->url,
                "bannerImageUrl": bannerImage.asset->url,
                volumeTraded,
                createdBy,
                contractAddress,
                "creator": createdBy->userName,
                title,
                floorPrice,
                "allOwners": owners[]->,
                description
            }
        `
        const collectionData = await sanityClient.fetch(marketItemQuery)
        console.log(collectionData, collectionId, '😶‍🌫️')
        setCollection(collectionData[0])
    }

    //whenever collectionId is updated, fetch the data for that collectionId
    useEffect(async () => {
        fetchCollectionData(collectionId)
    }, [collectionId])

    //when profile picture loads in, transition it into page
    const transitionProfilePicutre = useTransition(collection?.profileImageUrl, {
        from: {x: 0, y: 200, opacity: 0},
        enter: {x: 0, y: 0, opacity: 1},
        config: config.slow
    })

    //when title loads in, transition it into page
    const transitionTitle = useTransition(collection?.title, {
        from: {x: 0, y: 200, opacity: 0},
        enter: {x: 0, y: 0, opacity: 1, delay: 300},
        config: config.slow
    })

    //when data loads in, transition the chevrons in
    const transitionChevronContainer = useTransition(collection?.title, {
        from: { x: 0, y: 200, opacity: 0 },
        enter: { x: 0, y: 0, opacity: 1, delay: 500 },
        config: config.slow
    })

    const chevron1Animation = useSpring({
        loop: { reverse: true },
        config: { duration: 1000, easing: easings.easeInOutQuint },
        from: { opacity: 0.2, y: 0 },
        to: { opacity: 1, y: 5 }
    })

    const wrapperGenerator = () => {
        return collection?.bannerImageUrl ? collection.bannerImageUrl : style.defaultWrapper
    }

    return (
        <div className={style.defaultWrapper}>
            <Header/>
            <Parallax pages={2} ref={ref}>
                <ParallaxLayer offset={0} speed={1} style={style.parallax1Background}/>
                <ParallaxLayer offset={0} speed={0.25} style={style.profileImageParallexLayer}>
                    {transitionProfilePicutre((styles, item) => {
                        if (item) { return (
                            <animated.img style={styles} className={style.profileImage} src={collection?.profileImageUrl} alt='Profile Picture'/>
                        )}
                    })}
                </ParallaxLayer>
                <ParallaxLayer offset={-0.01} speed={0.25} style={style.profileImageParallexLayer}>
                    {transitionTitle((styles, item) => {
                        if (item) { return (
                            <animated.div style={styles} className={style.collectionTitle}>
                                {collection?.title}
                            </animated.div>
                        )}
                    })}
                </ParallaxLayer>
                <ParallaxLayer offset={0.3} speed={0.25} style={style.chevronParallexLayer}>
                    {transitionChevronContainer((styles, item) => {
                        if (item) { return (
                            <animated.div style={styles} className={style.chevronContainer} onClick={()=>ref.current.scrollTo(1)}>
                                <animated.div style={chevron1Animation}>
                                    <BsArrowDownCircleFill/>
                                </animated.div>
                            </animated.div>
                        )}
                    })}
                </ParallaxLayer>
                <ParallaxLayer offset={1} speed={0.1} style={style.parallax2Backgorund}>
                    <div className={style.aboutContainer}>
                        <div className={style.aboutLeftConatiner}>
                            <div className={style.titlePanel}>
                                <div className={style.titlePanelImageContainer}>
                                    <img src={collection?.profileImageUrl} alt='Profile Image'/>
                                </div>
                                <div className={style.titlePanelMainContentContainer}>
                                    Bored Ape Yacht Club
                                </div>
                            </div>
                            <div className={style.aboutPanel}>
                                <div className={style.aboutPanelCircle}/>
                                <div className={style.aboutPanelIcon}>
                                    <BsInfoCircle/>
                                </div>
                                <div className={style.aboutPanelTitle}>
                                    Description
                                </div>
                                <div className={style.aboutPanelMainContent}>
                                    {collection?.description}
                                </div>
                            </div>
                        </div>
                        <div className={style.aboutRightConatiner}>
                            <div className={style.creatorPanel}>
                                <div className={style.circle}/>
                                <div className={style.iconInCircle}>
                                    <BsPersonCircle/>
                                </div>
                                <div className={style.circleCardBodyContainer}>
                                    <div className={style.circleCardTitle}>
                                        Creator
                                    </div>
                                    <div className={style.creatorCardMainContentContainer}>
                                        <div>
                                            {collection?.creator} 
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={style.floorPricePanel}>
                                <div className={style.circle}/>
                                <div className={style.iconInCircle}>
                                    <BiArrowFromBottom/>
                                </div>
                                <div className={style.circleCardBodyContainer}>
                                    <div className={style.circleCardTitle}>
                                        Floor Price
                                    </div>
                                    <div className={style.circleCardMainContentContainer}>
                                        <div>
                                            {collection?.floorPrice} 
                                        </div>
                                        <div className={style.ethIcon}>
                                            <FaEthereum/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={style.volumeTradedPanel}>
                                <div className={style.circle}/>
                                <div className={style.iconInCircle}>
                                    <AiOutlineDollarCircle/>
                                </div>
                                <div className={style.circleCardBodyContainer}>
                                    <div className={style.circleCardTitle}>
                                        Volume Traded
                                    </div>
                                    <div className={style.circleCardMainContentContainer}>
                                        <div>
                                            {collection?.volumeTraded} 
                                        </div>
                                        <div className={style.ethIcon}>
                                            <FaEthereum/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ParallaxLayer>
            </Parallax>
        </div>
    )
}

export default Collection