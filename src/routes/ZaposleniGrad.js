// import axios from 'axios';
// import { useState, useEffect } from 'react';

// import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

// export default function ZaposleniGrad() {
//     const [data, setData] = useState(null);

//     useEffect(() => {
//         getData();
//     }, []);

//     async function getData() {
//         axios.get("http://localhost/KV/dzdb/domovi.php").then((response) => {
//             setData(response.data);
//         });
//     }

//     if (!data) return null;

//     // Grupiranje zaposlenika po djelatnosti i gradu
//     const zaposleniPoGradu = {};
//     data.forEach((dom) => {
//         dom.ord.forEach((ordinacija) => {
//             const djelatnost = ordinacija.djelatnost.naziv;
//             const grad = dom.grad;

//             if (!zaposleniPoGradu[djelatnost]) {
//                 zaposleniPoGradu[djelatnost] = {};
//             }

//             if (!zaposleniPoGradu[djelatnost][grad]) {
//                 zaposleniPoGradu[djelatnost][grad] = [];
//             }

//             zaposleniPoGradu[djelatnost][grad] = zaposleniPoGradu[djelatnost][grad].concat(ordinacija.oOsobe);
//         });
//     });

//     // Generiranje tabličnog prikaza
//     const tabela = Object.keys(zaposleniPoGradu).map((djelatnost, index) => (
//         <div key={index}>
//             <h2>{djelatnost}</h2>
//             <table className='table'>
//                 <thead>
//                     <tr>
//                         <th>R.br.</th>
//                         <th>Ime i prezime</th>
//                         <th>Tip</th>
//                         <th>Grad</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {Object.keys(zaposleniPoGradu[djelatnost]).map((grad, index) => (
//                         zaposleniPoGradu[djelatnost][grad].map((zaposlenik, index) => (
//                             <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{zaposlenik.ime} {zaposlenik.prezime}</td>
//                                 <td>{zaposlenik.tip}</td>
//                                 <td>{grad}</td>
//                             </tr>
//                         ))
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     ));

//     return (
//         <div>
//             {tabela}
//         </div>
//     );
// }
