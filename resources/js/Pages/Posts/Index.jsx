//import layout
import Layout from '../../Layouts/Default';

//import Link
import { Link } from '@inertiajs/react';

export default function PostIndex({ posts, flash }) {

  return (
    <Layout>
        <div style={{ marginTop: '100px' }}>

            <Link href="/posts/create" className="btn btn-success btn-md mb-3">TAMBAH POST</Link>

            {flash.message && (
                <div className="alert alert-success border-0 shadow-sm rounded-3">
                    {flash.message}
                </div>
            )}

            <div className="card border-0 rounded shadow-sm">
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th scope="col">TITLE</th>
                                <th scope="col">CONTENT</th>
                                <th scope="col">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                        { posts.map((post, index) => (
                            <tr key={ index }>
                                <td>{ post.title }</td>
                                <td>{ post.content }</td>
                                <td className="text-center">

                                </td>
                            </tr>
                        )) }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </Layout>
  )
}
