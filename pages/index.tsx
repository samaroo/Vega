import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'
import { useWeb3 } from '@3rdweb/hooks'

export default function Home() {

  return (
    <div>
      <Header/>
      <Hero/>
    </div>
  )
}
