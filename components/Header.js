import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import vLogo from '../assets/vlogo2.png'
import { AiOutlineSearch } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'
import { MdOutlineAccountBalanceWallet } from 'react-icons/md'

const style = {
    wrapper: `bg-white w-screen px-[1.2rem] py-[0.8rem] flex absolute top-0 left-0 z-10`,
    logoContainer: `flex items-center cursor-pointer`,
    logoText: `ml-[0.8rem] text-black font-logo font-thin text-4xl`,
    searchBar: `flex flex-1 mx-[2rem] w-max-[520px] items-center bg-[#ebebeb] rounded-[0.8rem] hover:bg-[#d4d4d4]`,
    searchIcon: `text-[#8a939b] mx-3 font-bold text-lg`,
    searchInput: `h-[2.6rem] w-full border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#363636] placeholder:text-[#8a939b]`,
    headerItems: `flex items-center justify-end`,
    headerItem: `text-black px-4 font-extrabold text-[#292929] hover:text-[#636363] cursor-pointer`,
    headerIcon: `text-[#292929] text-3xl font-thin px-4 hover:text-[#636363] cursor-pointer`,
}

const Header = () => {
  return (
    <div className={style.wrapper}>

        <Link href="/">
            <div className={style.logoContainer}>
                <Image src={vLogo} height={40} width = {40}/>
                <div className={style.logoText}>Vega</div>
            </div>
        </Link>

        <div className={style.searchBar}>

            <div className={style.searchIcon}>
            <AiOutlineSearch />
            </div>
            <input
            className={style.searchInput}
            placeholder="Search items, collections, and accounts"
            />
        </div>
        
        <div className={style.headerItems}>
            <div className={style.headerItem}> Collections </div>
            <div className={style.headerItem}> Stats </div>
            <div className={style.headerItem}> Resources </div>
            <div className={style.headerItem}> Create </div>
            <div className={style.headerIcon}>
                <CgProfile />
            </div>
            <div className={style.headerIcon}>
                <MdOutlineAccountBalanceWallet />
            </div>
        </div>

    </div>
  )
}

export default Header