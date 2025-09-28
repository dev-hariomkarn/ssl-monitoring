import forge from "node-forge";

// Generate private key (PEM format)
export function generatePrivateKey() {
  const keys = forge.pki.rsa.generateKeyPair(2048);
  return forge.pki.privateKeyToPem(keys.privateKey);
}

// Generate CSR (PEM format)
export function generateCsr(domain: string, altNames: string[] = []) {
  const keys = forge.pki.rsa.generateKeyPair(2048);

  const csr = forge.pki.createCertificationRequest();
  csr.publicKey = keys.publicKey;
  csr.setSubject([{ name: "commonName", value: domain }]);

  if (altNames.length > 0) {
    csr.setAttributes([
      {
        name: "extensionRequest",
        extensions: [
          {
            name: "subjectAltName",
            altNames: altNames.map((d) => ({ type: 2, value: d })), // type 2 = DNS
          },
        ],
      },
    ]);
  }

  csr.sign(keys.privateKey);

  const csrPem = forge.pki.certificationRequestToPem(csr);
  const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);

  return { csrPem, privateKeyPem };
}
