import Head from 'next/head'
import React from 'react'
import Layout, {siteTittle} from '../../components/layout'
import { useRouter } from 'next/router'


export default function ImprovementById(){
    const route = useRouter();
    
    return(
        <Layout>
            <Head>
                <title>{siteTittle}</title>
            </Head>
            <h1>This is a Improvement {route.query.id} </h1>
        </Layout>
        
    );
}