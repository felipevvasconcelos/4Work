import Head from 'next/head'
import React from 'react';
import Layout, {siteTittle} from '../../components/layout'

export default function Task(){
  return (
    <Layout>
      <Head>
        <title>{siteTittle}</title>
      </Head>
      <h1>This is Tasks</h1>
    </Layout>
  ) 
}