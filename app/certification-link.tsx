const certificates = [
 {matches:/google/i,url:'https://www.coursera.org/account/accomplishments/specialization/M3CUNS1Z5I2G'},
 {matches:/ztm|complete product design bootcamp/i,url:'https://www.udemy.com/certificate/UC-151edadf-3adf-44dc-a74b-901040953b5b/'},
];
export default function CertificationLink({title}:{title:string}){
 const certificate=certificates.find(c=>c.matches.test(title));
 return certificate?<a className="certificate-link" href={certificate.url} target="_blank" rel="noopener noreferrer">{title}<span aria-hidden="true"> ↗</span><span className="certificate-sr"> (opens certificate in a new tab)</span></a>:<>{title}</>;
}
