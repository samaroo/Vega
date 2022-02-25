import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import { useTransition, useSpring, animated, config } from 'react-spring'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { useWeb3 } from '@3rdweb/hooks'
import { ThirdwebSDK } from "@3rdweb/sdk";
import { client } from '../../lib/sanityClient'
import Header from '../../components/Header'
import image from '../../assets/background.jpeg'

const style = {
    wrapper: `w-screen h-screen bg-cover bg-[url("../assets/greyPolkaDot.jpeg")] grid place-items-center`,
    parallax1Background: { backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black', fontSize: '3rem', fontWeight: 'bold' },
    parallax2Backgorund: { backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '3rem', fontWeight: 'bold' },
    profileImageParallexLayer: {display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'none'},
    profileImage: 'w-[200px] h-[200px]'
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

    return (
        <div className={style.wrapper}>
            <Header/>
            <Parallax pages={2} ref={ref}>
                <ParallaxLayer offset={0} speed={1} style={style.parallax1Background}/>
                <ParallaxLayer offset={0} speed={0.25} style={style.profileImageParallexLayer}>
                    {transitionProfilePicutre((styles, item) => {
                        if (item) { return (
                            <animated.img style={styles} className={style.profileImage} src={collection?.profileImageUrl ? collection.profileImageUrl : '/loading.png'} />
                        )}
                    })}
                </ParallaxLayer>
                <ParallaxLayer offset={1} speed={1} style={style.parallax2Backgorund}>
                    Scroll Up
                </ParallaxLayer>
            </Parallax>
        </div>
    )
}

export default Collection