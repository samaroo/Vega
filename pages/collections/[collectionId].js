import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const Collection = () => {
    const router = useRouter()
    return (
        <div>{router.query.collectionId}</div>
    )
}

export default Collection