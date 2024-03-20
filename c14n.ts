/*
  <Signature ID?>
    <SignedInfo>
      <CanonicalizationMethod />
      <SignatureMethod />
    (<Reference URI? >
      (<Transforms>)?
        <DigestMethod>
        <DigestValue>
      </Reference>)+
    </SignedInfo>
    <SignatureValue>
  (<KeyInfo>)?
  (<Object ID?>)*
  </Signature>

  Procedure to sign

  In all cases, the procedure to sign the documents is the same.

  1. Prepare a base document with all the data in a well-formed XML format with placeholders in the <Signature> element. Be careful, white space is important.

  2. For each <Reference> in the signature:

  a. Compute the C14N transformation for the part of the document given in the reference.
  b. Compute the digest over this C14N transformed data
  c. Substitute the base64-encoded value of the digest in the <DigestValue> element.

  3. Compute the signature value over the C14N transformed <SignedInfo> element. We can do this in two stages:

  a. Compute the C14N transformation of the subset <SignedInfo>
  b. Compute an RSA signature over this using the signer's private key.

  4. Substitute the signature value encoded in base64 in the <SignatureValue> element
*/
