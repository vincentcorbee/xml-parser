import { X509Certificate } from 'crypto';
import { Lexer, Token } from './src/lexer';
import {
  Attributes,
  DeclaredEntities,
  DocumentNode,
  TagNode,
  TextNode
} from './src/types';
import { XMLParser } from './src/xml-parser';
import { XMLParser as FastXMLParser } from 'fast-xml-parser';
import { Entities } from './src/constants';

const fastXmlParser = new FastXMLParser({
  ignoreAttributes: false,
  htmlEntities: true
});

// const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
// <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
//   xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
//   xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
//   mc:Ignorable="x15 xr xr6 xr10 xr2"
//   xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"
//   xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision"
//   xmlns:xr6="http://schemas.microsoft.com/office/spreadsheetml/2016/revision6"
//   xmlns:xr10="http://schemas.microsoft.com/office/spreadsheetml/2016/revision10"
//   xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2">
//   <fileVersion appName="xl" lastEdited="7" lowestEdited="7" rupBuild="10911" />
//   <workbookPr />
//   <mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">
//     <mc:Choice Requires="x15">
//       <x15ac:absPath url="/Users/vincentcorbee/Downloads/"
//         xmlns:x15ac="http://schemas.microsoft.com/office/spreadsheetml/2010/11/ac" />
//     </mc:Choice>
//   </mc:AlternateContent>
//   <xr:revisionPtr revIDLastSave="0" documentId="13_ncr:1_{D7853D45-2765-F24D-9F1B-F981C436F65D}"
//     xr6:coauthVersionLast="47" xr6:coauthVersionMax="47"
//     xr10:uidLastSave="{00000000-0000-0000-0000-000000000000}" />
//   <bookViews>
//     <workbookView xWindow="0" yWindow="640" windowWidth="34560" windowHeight="21700"
//       xr2:uid="{00000000-000D-0000-FFFF-FFFF00000000}" />
//   </bookViews>
//   <sheets>
//     <sheet name="Speellijst" sheetId="1" r:id="rId1" />
//     <sheet name="Repertoire A" sheetId="2" r:id="rId2" />
//     <sheet name="Repertoire B" sheetId="3" r:id="rId3" />
//   </sheets>
//   <calcPr calcId="0" />
//   <extLst>
//     <ext uri="GoogleSheetsCustomDataVersion2">
//       <go:sheetsCustomData xmlns:go="http://customooxmlschemas.google.com/" r:id="rId7"
//         roundtripDataChecksum="7xk2wayvVajl6oiZXzhuWL6y1Kq5BT7J5g6LOsaUEEY=" />
//     </ext>
//   </extLst>
// </workbook>`

// const xml = `
// <?xml version="1.0" encoding="UTF-8"?>

// <!DOCTYPE note [
// <!ENTITY nbsp "&#xA0;">
// <!ENTITY writer "Writer: Donald Duck.">
// <!ENTITY copyright "Copyright: W3Schools.">
// ]>

// <note>
//     <to>Tove</to>
//     <from>Jani</from>
//     <heading>Reminder</heading>
//     <body attr="&writer;">Don't forget me this weekend!</body>
//     <footer>&writer;&nbsp;&copyright;</footer>
// </note>`

// const xml = `<A/>`

// const xml = `<?xml version="1.0" encoding="UTF-8"?>
// <ns3:DirectoryRes xmlns:ns3="http://www.betaalvereniging.nl/iDx/messages/Merchant-Acquirer/1.0.0"
//     xmlns="http://www.w3.org/2000/09/xmldsig#"
//     xmlns:ns10="urn:oasis:names:tc:SAML:2.0:profiles:SSO:ecp"
//     xmlns:ns2="http://www.w3.org/2001/04/xmlenc#" xmlns:ns4="urn:oasis:names:tc:SAML:2.0:ac"
//     xmlns:ns5="urn:oasis:names:tc:SAML:2.0:assertion"
//     xmlns:ns6="urn:oasis:names:tc:SAML:2.0:metadata"
//     xmlns:ns7="http://schemas.xmlsoap.org/soap/envelope/"
//     xmlns:ns8="urn:oasis:names:tc:SAML:2.0:protocol"
//     xmlns:ns9="urn:oasis:names:tc:SAML:2.0:profiles:attribute:DCE" productID="NL:BVN:BankID:1.0"
//     version="1.0.0">
//     <ns3:createDateTimestamp>2024-02-16T15:08:40.086Z</ns3:createDateTimestamp>
//     <ns3:Acquirer>
//         <ns3:acquirerID>0030</ns3:acquirerID>
//     </ns3:Acquirer>
//     <ns3:Directory>
//         <ns3:directoryDateTimestamp>2022-10-04T07:57:00.000Z</ns3:directoryDateTimestamp>
//         <ns3:Country>
//             <ns3:countryNames>Nederland</ns3:countryNames>
//             <ns3:Issuer>
//                 <ns3:issuerID>ABNANL2A</ns3:issuerID>
//                 <ns3:issuerName>ABN AMRO</ns3:issuerName>
//             </ns3:Issuer>
//             <ns3:Issuer>
//                 <ns3:issuerID>ASNBNL21</ns3:issuerID>
//                 <ns3:issuerName>ASN Bank</ns3:issuerName>
//             </ns3:Issuer>
//             <ns3:Issuer>
//                 <ns3:issuerID>BUNQNL2A</ns3:issuerID>
//                 <ns3:issuerName>bunq</ns3:issuerName>
//             </ns3:Issuer>
//             <ns3:Issuer>
//                 <ns3:issuerID>INGBNL2A</ns3:issuerID>
//                 <ns3:issuerName>ING</ns3:issuerName>
//             </ns3:Issuer>
//             <ns3:Issuer>
//                 <ns3:issuerID>RABONL2U</ns3:issuerID>
//                 <ns3:issuerName>Rabobank</ns3:issuerName>
//             </ns3:Issuer>
//             <ns3:Issuer>
//                 <ns3:issuerID>RBRBNL21</ns3:issuerID>
//                 <ns3:issuerName>RegioBank</ns3:issuerName>
//             </ns3:Issuer>
//             <ns3:Issuer>
//                 <ns3:issuerID>SNSBNL2A</ns3:issuerID>
//                 <ns3:issuerName>SNS</ns3:issuerName>
//             </ns3:Issuer>
//         </ns3:Country>
//     </ns3:Directory>
//     <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
//         <SignedInfo>
//             <CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" />
//             <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" />
//             <Reference URI="">
//                 <Transforms>
//                     <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" />
//                     <Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" />
//                 </Transforms>
//                 <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" />
//                 <DigestValue>XKKh95f3TbHXKVuyVTUCdYQDn2do2JQ6vLcTYR960jY=</DigestValue>
//             </Reference>
//         </SignedInfo>
//         <SignatureValue>
//             zzp/fxcdT5CKpy2+DLIda/OCITNnJDYsR3Ap8+uR43cLTrFpp6q1sIn3oho0j8miJl/VoOmS115V9BO1uL4sPPGVbjabILXPwHRQPGkcv8rO/66pV6Sbxv6pRCUS5yAXRGwHrDA160sMf0aO6YUU3qrMJXc8OmkLLnAamhsMlg7aVQfcGpz+NXHYvBImMWLFTGXdEzaLmpuPpb4hN1B5YBMeV/VMxD922Eq+8JfVMT1ycmDFZDpgi+2tBeZDZthoas9GkSfIUDdx5waUULNT+jRQJznXQwhw4/RyQUh+QNhht0ORe9UREgfexHtMuserUAIsSNnYhrpawMSbzusReQ==</SignatureValue>
//         <KeyInfo>
//             <KeyName>A7C247C4A2F795BBD0BDFB5C56ED4CDC86B60368</KeyName>
//         </KeyInfo>
//     </Signature>
// </ns3:DirectoryRes>`

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<awidxma:AcquirerStatusRes
    xmlns:awidxma="http://www.betaalvereniging.nl/iDx/messages/Merchant-Acquirer/1.0.0"
    xmlns:awenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:awsamac="urn:oasis:names:tc:SAML:2.0:ac"
    xmlns:awsamdce="urn:oasis:names:tc:SAML:2.0:profiles:attribute:DCE"
    xmlns:awsamecp="urn:oasis:names:tc:SAML:2.0:profiles:SSO:ecp"
    xmlns:awsammeta="urn:oasis:names:tc:SAML:2.0:metadata"
    xmlns:ns2="http://www.w3.org/2000/09/xmldsig#"
    xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion"
    xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" productID="NL:BVN:BankID:1.0" version="1.0.0">
    <awidxma:createDateTimestamp>2024-02-22T15:01:12.959Z</awidxma:createDateTimestamp>
    <awidxma:Acquirer>
        <awidxma:acquirerID>0030</awidxma:acquirerID>
    </awidxma:Acquirer>
    <awidxma:Transaction>
        <awidxma:transactionID>0030000631990503</awidxma:transactionID>
        <awidxma:status>Success</awidxma:status>
        <awidxma:statusDateTimestamp>2024-02-22T15:00:47.711Z</awidxma:statusDateTimestamp>
        <awidxma:container>
            <saml2p:Response ID="RES-0030000631990503"
                InResponseTo="a3bf35f18bad4a25a06c1a305577e1aa"
                IssueInstant="2024-02-22T15:01:12.740Z" Version="2.0"
                xmlns:saml2p="urn:oasis:names:tc:SAML:2.0:protocol">
                <saml2:Issuer xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">0030</saml2:Issuer>
                <saml2p:Status>
                    <saml2p:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success">
                        <saml2p:StatusCode
                            Value="urn:nl:bvn:bankid:1.0:status:IncompleteAttributeSet" />
                    </saml2p:StatusCode>
                </saml2p:Status>
                <saml2:Assertion ID="VS-0030000631990503" IssueInstant="2024-02-22T15:01:12.740Z"
                    Version="2.0" xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">
                    <saml2:Issuer>INGBNL2A</saml2:Issuer>
                    <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                        <ds:SignedInfo>
                            <ds:CanonicalizationMethod
                                Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" />
                            <ds:SignatureMethod
                                Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" />
                            <ds:Reference URI="#VS-0030000631990503">
                                <ds:Transforms>
                                    <ds:Transform
                                        Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" />
                                    <ds:Transform
                                        Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" />
                                </ds:Transforms>
                                <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" />
                                <ds:DigestValue>CInJtRzst1MYgiHdf0unP/BuCAxBb0PZk0FVspq6Jos=</ds:DigestValue>
                            </ds:Reference>
                        </ds:SignedInfo>
                        <ds:SignatureValue>
                            EcHfKF+nMsGexOBZpIbpABd6IQiBmGc9pGxvG+/znl2oNMGZCiE/6Ji8DFmqEgPfpPVRDirrO9v4yGgsNOYSTV9eqxre9SOW7MFLfXVEpiCojzxT9qsCaxIToW0+olqiokH7ce+YyxZdW0en934CBvpOlt3Sy1c8yQxIFidzL64ii5GDcfEOMh6SE4B5Z3CSdjy1d8UzKkF0CJm/zv0tRCd7qtKuzPJHLypBLA3CksH3iodqFLexPvS8e1OeFysJyln38mqRLPmYe76gl0W8QuT3cbdCR2e8mExbyffgJgnde1tuvcvy3hKvByWLDaUtWbx07b2pi0T07+GNPIXbnA==</ds:SignatureValue>
                        <ds:KeyInfo>
                            <ds:X509Data>
                                <ds:X509Certificate>MIIHJjCCBg6gAwIBAgIQKBwIMKDJBmbYYz31SwIVizANBgkqhkiG9w0BAQsFADCBujELMAkGA1UE
                                    BhMCVVMxFjAUBgNVBAoTDUVudHJ1c3QsIEluYy4xKDAmBgNVBAsTH1NlZSB3d3cuZW50cnVzdC5u
                                    ZXQvbGVnYWwtdGVybXMxOTA3BgNVBAsTMChjKSAyMDE0IEVudHJ1c3QsIEluYy4gLSBmb3IgYXV0
                                    aG9yaXplZCB1c2Ugb25seTEuMCwGA1UEAxMlRW50cnVzdCBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0
                                    eSAtIEwxTTAeFw0yMzA4MDExMjE1MjNaFw0yNDA4MDExMjE1MjJaMIG3MQswCQYDVQQGEwJOTDEW
                                    MBQGA1UECBMNTm9vcmQtSG9sbGFuZDESMBAGA1UEBxMJQW1zdGVyZGFtMRMwEQYLKwYBBAGCNzwC
                                    AQMTAk5MMRcwFQYDVQQKEw5JTkcgR3JvZXAgTi5WLjEdMBsGA1UEDxMUUHJpdmF0ZSBPcmdhbml6
                                    YXRpb24xETAPBgNVBAUTCDMzMjMxMDczMRwwGgYDVQQDExNpZGVhbC1pc3N1ZXIuaW5nLm5sMIIB
                                    IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr0bHJsdBfE2B5GGqNI7V+kDekmdc62JD6W9b
                                    ThjsznLcHXlzBdE47bnPh9XtvgsyKP6NPvifQH92k57i9K3myti6nFtZnmHhXeW8njPjbTvWF+Dp
                                    9E/LZDqHf577n65M1DmnaUHJ1J44gIWy2PrY4jWKVSmCZcRpezE9DUmUfRRC1gjGi8akWSoSlYSI
                                    1edu6JY2/+qP6F0SUkDMrO2DcBGBdJR4YRE2HpgTv1kIRw6x+X2mcMKxnkbr2Y0Gu6iLMU/qOjTY
                                    ouOfwlylf5504zkSA9QgfYa6OqwVRaTO/TcqjtqTeaXryWbCx6iKS7xhynHWmmCceJSjKh5Ivu3+
                                    FQIDAQABo4IDJzCCAyMwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQUYUIaemvY7hAuXQ4G7KvlK8tW
                                    KwgwHwYDVR0jBBgwFoAUw/fQtSowra8NkSFwOVTdvIlwxzowaAYIKwYBBQUHAQEEXDBaMCMGCCsG
                                    AQUFBzABhhdodHRwOi8vb2NzcC5lbnRydXN0Lm5ldDAzBggrBgEFBQcwAoYnaHR0cDovL2FpYS5l
                                    bnRydXN0Lm5ldC9sMW0tY2hhaW4yNTYuY2VyMDMGA1UdHwQsMCowKKAmoCSGImh0dHA6Ly9jcmwu
                                    ZW50cnVzdC5uZXQvbGV2ZWwxbS5jcmwwNwYDVR0RBDAwLoITaWRlYWwtaXNzdWVyLmluZy5ubIIX
                                    d3d3LmlkZWFsLWlzc3Vlci5pbmcubmwwDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUF
                                    BwMBBggrBgEFBQcDAjBLBgNVHSAERDBCMDcGCmCGSAGG+mwKAQIwKTAnBggrBgEFBQcCARYbaHR0
                                    cHM6Ly93d3cuZW50cnVzdC5uZXQvcnBhMAcGBWeBDAEBMIIBfQYKKwYBBAHWeQIEAgSCAW0EggFp
                                    AWcAdQDuzdBk1dsazsVct520zROiModGfLzs3sNRSFlGcR+1mwAAAYmxBj8oAAAEAwBGMEQCIBfP
                                    Jp2NesdyUnjqTX3hp+mbqJ6qaY7amB/NHTXvfj2aAiBDhWzm+AwuR90RcQN5VJkEFc8fGkEEeuhE
                                    DMw5A9e6/wB2AD8XS0/XIkdYlB1lHIS+DRLtkDd/H4Vq68G/KIXs+GRuAAABibEGP2UAAAQDAEcw
                                    RQIgEjZFsYth0ChUuOdO0TNM47lhJpKSn/TAIbgg1vS2AksCIQCphpLyw8OXF0IckNN4jX64BXDF
                                    s4DUo2ck/8oarYTTZAB2ANq2v2s/tbYin5vCu1xr6HCRcWy7UYSFNL2kPTBI1/urAAABibEGP3kA
                                    AAQDAEcwRQIhALdv8uNKnmWfNB4AcR3kZLbWfDgDvV9nthebUkrQpJC6AiATCeDR2ew2tvLv+uNN
                                    piI6XCnjay38/1BFzCaYtyMEGDANBgkqhkiG9w0BAQsFAAOCAQEAuSnNsFO4KLvdiEjOJnA+vNX8
                                    NuEYS1MHdUIZRFwr+aTUCbWGQ6/T840OGcmecgDlvsvMMiW5l8cy/RpWmSFzHWcoA7a7O9Nfk4hw
                                    tU4vs3VtPeGIxXv/vbFXijXRskIissSNllt/hs3NrSwY2SwMohgjKtQyZm1/XAgL4vD8egICdtUo
                                    psZ4/cl7jf1W7TNjB/B2iOd8nkXuj15lr6rGEE915gOwmW21Xw7u/gERex8p7Kg2yiYRcl1OBao7
                                    EIeoEU6nLUMrCewdLtY237EcOSsROZJXRXp/ZOi+co2WrkN7K+2tAFvJUdmPC+72tSjtghUXe4bN
                                    o/Zb2xNWuQDKAQ==</ds:X509Certificate>
                            </ds:X509Data>
                        </ds:KeyInfo>
                    </ds:Signature>
                    <saml2:Subject>
                        <saml2:EncryptedID>
                            <xenc:EncryptedData Type="http://www.w3.org/2001/04/xmlenc#Element"
                                xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                <xenc:EncryptionMethod
                                    Algorithm="http://www.w3.org/2001/04/xmlenc#aes256-cbc"
                                    xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" />
                                <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                                    <xenc:EncryptedKey Recipient="NL86ZZZ405309340000"
                                        xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                        <xenc:EncryptionMethod
                                            Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <ds:DigestMethod
                                                Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"
                                                xmlns:ds="http://www.w3.org/2000/09/xmldsig#" />
                                        </xenc:EncryptionMethod>
                                        <xenc:CipherData
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <xenc:CipherValue>
                                                QtFdriCVSAQiKAH+c6Rc0x4bEoLIlk93YW5j4GZdEpgB+bSZRbk6U51m2VUG5mED6BaYwO/kRDDmdsfOgNXJRk5F9n41wre9DaU6LX6jziajAR0h1jEL/wBQzOAFjEymb2Xp3LiC1ui9utjKSwVQBmXXjN/FcIGTD8ygefQOToOzl2BcjXB7wBWDh1oxcruNrHaTw3grZ3dfTrlnniPVw2uvONIT24bveLVTYNDp54AALfAeFkRmkuJJhyFPpBkTWUzAN7MmeAI4wzqKlo+FwImOvhpcWWYbqoleFbVXAopJUmgLSeub1wLJlSa363hXq9+Qft40BollPvTf3XRKVw==</xenc:CipherValue>
                                        </xenc:CipherData>
                                    </xenc:EncryptedKey>
                                </ds:KeyInfo>
                                <xenc:CipherData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                    <xenc:CipherValue>
                                        VanpcdrdOIM3ys2RcHleaqoatw0TgYWXOw+Kd9fjOLjYw8n2Wzjs+xh0xEDGrM3rUYISQ/8Sex8sNucxgiA8VjMrwCeNXjjZSQ4Dy0whcVQU08rx51upj2qnR4L1/gg18p4hRJyQunKykDlaohu+Vrj4PblQMkTNOrrNpn2Atg7IVB6VlcHiGASsFXALWG69VWdFivJIrNljs7VKeDxMdbG7KBa8L0krzQ+GBT3bU0ViWHkG2IePKT4NhZYQcTh3</xenc:CipherValue>
                                </xenc:CipherData>
                            </xenc:EncryptedData>
                        </saml2:EncryptedID>
                    </saml2:Subject>
                    <saml2:Conditions NotBefore="2024-02-22T15:00:47.696Z"
                        NotOnOrAfter="2024-02-22T15:01:17.696Z">
                        <saml2:AudienceRestriction>
                            <saml2:Audience>NL86ZZZ405309340000</saml2:Audience>
                        </saml2:AudienceRestriction>
                        <saml2:OneTimeUse />
                    </saml2:Conditions>
                    <saml2:AuthnStatement AuthnInstant="2024-02-22T15:01:12.740Z">
                        <saml2:AuthnContext>
                            <saml2:AuthnContextClassRef>nl:bvn:bankid:1.0:loa3</saml2:AuthnContextClassRef>
                            <saml2:AuthenticatingAuthority>INGBNL2A</saml2:AuthenticatingAuthority>
                        </saml2:AuthnContext>
                    </saml2:AuthnStatement>
                    <saml2:AttributeStatement>
                        <saml2:Attribute Name="urn:nl:bvn:bankid:1.0:bankid.deliveredserviceid">
                            <saml2:AttributeValue>21968</saml2:AttributeValue>
                        </saml2:Attribute>
                        <saml2:EncryptedAttribute>
                            <xenc:EncryptedData Type="http://www.w3.org/2001/04/xmlenc#Element"
                                xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                <xenc:EncryptionMethod
                                    Algorithm="http://www.w3.org/2001/04/xmlenc#aes256-cbc"
                                    xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" />
                                <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                                    <xenc:EncryptedKey Recipient="NL86ZZZ405309340000"
                                        xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                        <xenc:EncryptionMethod
                                            Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <ds:DigestMethod
                                                Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"
                                                xmlns:ds="http://www.w3.org/2000/09/xmldsig#" />
                                        </xenc:EncryptionMethod>
                                        <xenc:CipherData
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <xenc:CipherValue>
                                                LE6LD6PL7IPiRQ4eSfQaptI4Vm2wzNgYAHfUFA8dBypxs+HJsR0xT8IJrFr3DfitMSjIPdaLj/KDi0gAOPmPSlT528H+aauIFTi5HKo6uOzUqYA5BWWOW7yD6unciggkwI/F40IGu4QhNNqqyl92tQUp/g5ErnO+MGpnWAlS5xSP3rKcRafTKzxISDcAj9oOidBJpRI3p5VW9tn77Op//DKtc4+5U7O5xZapw+PqacnYPgOTI2gQ4P3WHZvdcWjI3Nv2Fj6CaWRBUai2vgzLdHoDZifzxhtW2OVF0zodaVJ7fmBxkyeg/SPbAWFf9Q1965a6Px3mYOBFMtly5ysucw==</xenc:CipherValue>
                                        </xenc:CipherData>
                                    </xenc:EncryptedKey>
                                </ds:KeyInfo>
                                <xenc:CipherData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                    <xenc:CipherValue>
                                        yk2UuWy1DbflXHupjsc32xhvoj+1yJnjxSqz6ZAi9ZL7GHgnOyNReNgsRpSDvt6r5tZGKMNAuh3misfiRTFKkI/b6ERuH9bntziPudMAGclWmT/SXpw9+fy5PnXzLU4TaboTtF9JzI6B+towviDkRj+SVjQoCp+iRLV/P4nfl4v3E93vEvr38p1+5pALmjKcW/ak15/Jer2bLiKh35eY76LUCpZsNgoWn06/1lOFfLRLu5ay1uKMCyQOw5ObQEjmS8oBVuWJOc8mTThsRFep7g==</xenc:CipherValue>
                                </xenc:CipherData>
                            </xenc:EncryptedData>
                        </saml2:EncryptedAttribute>
                        <saml2:EncryptedAttribute>
                            <xenc:EncryptedData Type="http://www.w3.org/2001/04/xmlenc#Element"
                                xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                <xenc:EncryptionMethod
                                    Algorithm="http://www.w3.org/2001/04/xmlenc#aes256-cbc"
                                    xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" />
                                <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                                    <xenc:EncryptedKey Recipient="NL86ZZZ405309340000"
                                        xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                        <xenc:EncryptionMethod
                                            Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <ds:DigestMethod
                                                Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"
                                                xmlns:ds="http://www.w3.org/2000/09/xmldsig#" />
                                        </xenc:EncryptionMethod>
                                        <xenc:CipherData
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <xenc:CipherValue>
                                                B8TQC6154u0fmXdwPPq8Ixng0o0gWlctr4XeWmwT00UvxVkYTRqfpEEXEhLMYQXg5//KTN7F/wNp5IJsqs6QzXghxg2oCcBwu5AeSgoA/N0BZLR68irIUp2LLWB/P5SGsp2VWG/MHYHItT6nHJvYLqQy+J2yRatMuh6zrrR4XH/y8dIWvtQwBiRehpbhcW11ebRXX+Gv3td1iiOJmv3sYFHVWKPowkFlcBAOkJsb2i31nA5LxPw0TCvpEJPlHZ18NFEza26Yb3i3ixkyqcNSEN/a9I5sxQfROViBG8b5m4CXb2JwCUOm4E1g4Qu4odNvjiwJBopyA3/MKy1E6QNSbw==</xenc:CipherValue>
                                        </xenc:CipherData>
                                    </xenc:EncryptedKey>
                                </ds:KeyInfo>
                                <xenc:CipherData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                    <xenc:CipherValue>
                                        UCqjjo1YksKgPHuI1iVn9yXF9UyNWX8PoUBaEEQubjZsrYKnMqncSw48wNEcwQnXeIyMkHrLPW1wDvPRAFI48ukLopJ1VW84GDizY+IcFypNBzlptRel5IfiiS0fKV6Svds3r5ycb363ICW1ct/Kf20uQEtDmgMm53HETg8GEBUmaBpAJojpWqZl53qoUzl/2rh0YsXiKOqKZMKDG4PvHiiE1mh9yC2XYqEHYHo++hO9G29auw/0bxHxWG4hTvfZSUfyM39wzuVfHp4t1zXaFQ==</xenc:CipherValue>
                                </xenc:CipherData>
                            </xenc:EncryptedData>
                        </saml2:EncryptedAttribute>
                        <saml2:EncryptedAttribute>
                            <xenc:EncryptedData Type="http://www.w3.org/2001/04/xmlenc#Element"
                                xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                <xenc:EncryptionMethod
                                    Algorithm="http://www.w3.org/2001/04/xmlenc#aes256-cbc"
                                    xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" />
                                <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                                    <xenc:EncryptedKey Recipient="NL86ZZZ405309340000"
                                        xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                        <xenc:EncryptionMethod
                                            Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <ds:DigestMethod
                                                Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"
                                                xmlns:ds="http://www.w3.org/2000/09/xmldsig#" />
                                        </xenc:EncryptionMethod>
                                        <xenc:CipherData
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <xenc:CipherValue>
                                                WUXLDjXCFWpQnL3zubfgqrk2C/B58HsyJEGlLWwaHGTBRWLaJYfDOV+IYzj3xt6KBcWHpFkxYaVONBXljf50heKxEFub9LwxdoAmYXFPSyzKJiFzEgb2K0qeqtWyI7vitmIevwvvQed0zoBWIKQbyRIjHd468JI7uZ+mHap9cYe04GYk0ILpywTrgoaYp+5j8QgQ1evKj4oa0m2qgtIoBfzTLSHeIOWwbFRqPmTWTi2EhtVthzwBnZEx4mlFJbUguiFnyMvI5kVwK3oHzD8I1pSDx+xjJssUX/tfoXcWNqa97CtDLYW3UbO4/1z84Pxa7aJECr5gTGkir8c8BU+E2A==</xenc:CipherValue>
                                        </xenc:CipherData>
                                    </xenc:EncryptedKey>
                                </ds:KeyInfo>
                                <xenc:CipherData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                    <xenc:CipherValue>
                                        gvCfKeElI3WF4GaoDH4vllPG14u8RPoLo9vFgGEhMoVHZo020kD1Jnl2qlbRYEpY9UbvA/E1vlCZDwTXvSmHgDynsbPpEepoOUdOLtjBixL6xJfpcznddP3CbHVN1dMlwgF/Mu1cALkDG9/Oos9KjTlndffWeXSOh96BjgkmV4xxDFNmncL2d/EAYV/yUTuCzrMyV7aoY4hAcqycIKiaNyUnBSJvsCU55cPx/1/muCiawF1wgT0zY3jcny8DTaptuFjCahwlAs8QhrJrl/8HpA==</xenc:CipherValue>
                                </xenc:CipherData>
                            </xenc:EncryptedData>
                        </saml2:EncryptedAttribute>
                        <saml2:EncryptedAttribute>
                            <xenc:EncryptedData Type="http://www.w3.org/2001/04/xmlenc#Element"
                                xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                <xenc:EncryptionMethod
                                    Algorithm="http://www.w3.org/2001/04/xmlenc#aes256-cbc"
                                    xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" />
                                <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                                    <xenc:EncryptedKey Recipient="NL86ZZZ405309340000"
                                        xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                        <xenc:EncryptionMethod
                                            Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <ds:DigestMethod
                                                Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"
                                                xmlns:ds="http://www.w3.org/2000/09/xmldsig#" />
                                        </xenc:EncryptionMethod>
                                        <xenc:CipherData
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <xenc:CipherValue>
                                                iMfSRF4NKIcyR9G7Fez+Y0RSkNYuFMdO0M1c9KR44R5u7yxS8me2D5UN+PSpmVU5J29s9ieGHPRBqpGMZ+2evh+fm/oprRQlm2N2UgcwaEPmIfc5TCS9Y8wpsRQjBgU30SHs5ZplSRPIruoF4dZqFRvBY23aT0yn9YGVnkcNSRYyBE7jCmIL8MkYhfQpFxgCxlbr/Kj8RI4DnJfwsHsSkpZX2jG7OgtJqy/C381mZo4vhr9ysdfM1dr7vb44cvPGRqKLSw42VCvbGldhiaXqLqNZgBdAJkkRNJfvdHbMLGlXYwB9d5tXFECDh89N9UwlXUqrW4JiwCLxlYP1AK9yQA==</xenc:CipherValue>
                                        </xenc:CipherData>
                                    </xenc:EncryptedKey>
                                </ds:KeyInfo>
                                <xenc:CipherData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                    <xenc:CipherValue>
                                        bW6gFU1zYvspv0ax98RVspk85mh2Im6FhJ04VkYT5WVbErjX6YDBwxajXQ32rOeAfglMovdbcK33mOst2lrpbGlq56W6echay/ddwcagwJDIZL3A39t2VozORugvccrhfpB+D09dZba67VAaIMe1naa9psFth94Yc518OZ6LOmmFQowOyxfV/MnKhL0d+QqdwYPKmdgF2IESxQX6j04gTTzYmH2UKK3xKK4eW8OaxpXqwB/8ZWYF2V/G+xvDgvtaBMNIqbt4ZZRF57w69jqevA==</xenc:CipherValue>
                                </xenc:CipherData>
                            </xenc:EncryptedData>
                        </saml2:EncryptedAttribute>
                        <saml2:EncryptedAttribute>
                            <xenc:EncryptedData Type="http://www.w3.org/2001/04/xmlenc#Element"
                                xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                <xenc:EncryptionMethod
                                    Algorithm="http://www.w3.org/2001/04/xmlenc#aes256-cbc"
                                    xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" />
                                <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                                    <xenc:EncryptedKey Recipient="NL86ZZZ405309340000"
                                        xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                        <xenc:EncryptionMethod
                                            Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <ds:DigestMethod
                                                Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"
                                                xmlns:ds="http://www.w3.org/2000/09/xmldsig#" />
                                        </xenc:EncryptionMethod>
                                        <xenc:CipherData
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <xenc:CipherValue>
                                                hEe/RukIzyictcKjNson0HrlWPTRqEAN7XrFVhwz9zdLVY3b/Y72OINf9w3G49t3BHk5ZoqHErKsUcJuprWXWjrW6VjIxXMruhaa2kXIxgy73PRa7uBt2dELexfyqFZG3Ssf2r4QgB4xC4WxxoREIwNmaZm2TCzg9w1HPQ5loyRMPWmPGXe22k2KI1IqVtOwMolOJX80/7N1dquP0JXa+ypLDlSO995BltBHUNCPFV/q1PnRaXBjOuZ6bD+UWonF5WsXnF16m3MGQZcKhJXoPg35MbOM+RiU+ECKafnYErkxhOryNxR6sLZjsB3BqRKFzs3i8CTN3dOFPAki5ce4QA==</xenc:CipherValue>
                                        </xenc:CipherData>
                                    </xenc:EncryptedKey>
                                </ds:KeyInfo>
                                <xenc:CipherData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                    <xenc:CipherValue>
                                        OXF8YdA6YbA7V63h9g5tFBw5WSwIyVU6YwQyQbtDcrPRDqANVbKeSYTM86y6oUMloUCvNvnq10jF9gwmzwjADFUWcrNq/G1LDgvvfkC3/f3ngkdTw1/gg5HjD7ctQ1RWJNrFoY3WH8YBEEX+uJcDCWnO8IVgocf2hG7JJY7H7RoIOJXJv1iNMkbHmsF7Ks9+C6wBr1PvoZEE7CB/G5oec81Y06miyI+1iZJIhooFVXVyybWLFuBmGPywUbB/1IFYLqpoXp1mwa98mpCqX0FRqw==</xenc:CipherValue>
                                </xenc:CipherData>
                            </xenc:EncryptedData>
                        </saml2:EncryptedAttribute>
                        <saml2:EncryptedAttribute>
                            <xenc:EncryptedData Type="http://www.w3.org/2001/04/xmlenc#Element"
                                xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                <xenc:EncryptionMethod
                                    Algorithm="http://www.w3.org/2001/04/xmlenc#aes256-cbc"
                                    xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" />
                                <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                                    <xenc:EncryptedKey Recipient="NL86ZZZ405309340000"
                                        xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                        <xenc:EncryptionMethod
                                            Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <ds:DigestMethod
                                                Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"
                                                xmlns:ds="http://www.w3.org/2000/09/xmldsig#" />
                                        </xenc:EncryptionMethod>
                                        <xenc:CipherData
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <xenc:CipherValue>
                                                iq1wd1YUdvr53Bm5ouyTta8xS9Rr9pefpA3rno0lNOUqxPjAZeOBhX3nGdEPPN/1Ru0mV9W63+g2ChYHOcPUTaD2bs0rEmfIhgRPNIkJXgqm89gvc+a/O16LdaMEC5J5Xb9BxSQrhV+xH4YH/+TSKNj53oYSXN1TcGeveON7q1Po+h4++isnj4k0522DdvLShTO2w8/ysE5Y+lBTpT1oIvVFUJFnJ55XODT6lzKfFNITSr9uEuQN9Cd2THlr6Yy3h81ax1jz2ltaEJnoyn97jL88XoNS2+y0FzRPDSrWMysbddSA8gjaonW1bISHLy1PRXvOumpifO2V7y440IJ2Yw==</xenc:CipherValue>
                                        </xenc:CipherData>
                                    </xenc:EncryptedKey>
                                </ds:KeyInfo>
                                <xenc:CipherData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                    <xenc:CipherValue>
                                        EQmFUR51Fz31WeTyB8zoF5oGdEjo/zm5gnjPgRcLZhmG0poJn2oTeeYKFDoBSVdcNCvuRqazMNXmbHpj6aYwx0yIl6gwV2pu2gpFtPN/R1trAsmcExSF9eM6pjJDKvdqfxIPfG4gqBa6yullpYVf9FvMVzIi2PyhvVReu4GZIardfhu8gr0nlycb/hxYsFrv4t/qRQe1sfqvmtjHiFgOwSLxlLAoaF0xL0/Fc5CnV1dUd9kl2Kii3d1arlqR0waK4O3RzKvIVIaNK8TXhZmyXQ==</xenc:CipherValue>
                                </xenc:CipherData>
                            </xenc:EncryptedData>
                        </saml2:EncryptedAttribute>
                        <saml2:EncryptedAttribute>
                            <xenc:EncryptedData Type="http://www.w3.org/2001/04/xmlenc#Element"
                                xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                <xenc:EncryptionMethod
                                    Algorithm="http://www.w3.org/2001/04/xmlenc#aes256-cbc"
                                    xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" />
                                <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                                    <xenc:EncryptedKey Recipient="NL86ZZZ405309340000"
                                        xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                        <xenc:EncryptionMethod
                                            Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <ds:DigestMethod
                                                Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"
                                                xmlns:ds="http://www.w3.org/2000/09/xmldsig#" />
                                        </xenc:EncryptionMethod>
                                        <xenc:CipherData
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <xenc:CipherValue>
                                                d5X2vEmzjyOwDPfzebheYoEtSwGiS3epTafExkXsv247IV/YI8snJwMXBTBvnUcpkhFAU84G7oPPEpR0QQxYKkmHQFUdZtK1T/lNwFUIzhlJ+wlnmwos48OzVSsI60Y5s+zBceQabGG01KMcbw4viMLLyw2s/s/i1ZwvoA4Poqj4Zvr5Dga9k58/xU4B2+UehotjS2MsQjKa4urq4M2XS5RNKPO6OStaNu5jB188y7I49n2hs9sbyzy9s6+ML4Ludoc8r8wb3ufVO20zcIwhQ9fLI86xo0+dPpQC02K/DjLl0XejowG4Ny1FR0DI2JAXFO8KAf7HmtfSicVBZd6kAg==</xenc:CipherValue>
                                        </xenc:CipherData>
                                    </xenc:EncryptedKey>
                                </ds:KeyInfo>
                                <xenc:CipherData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                    <xenc:CipherValue>
                                        l8YaIC88mNPmaUVdFXm8YdWwuKwFI5C1pqRUjtKrDO+pa9oF9RG/NSQMWYdlpESrH7XKMvcUg/Uj6U7qOqr9oMACYvUQ5SY9dbvsNB+Ttx97wlE/vElqzXgegwVCwLW1LcKNaEpkisCA10FrJH5dmKZxIYicwlrsa7vRHaoWpRhYyqZZ8127tiLGQj10bmHweD+EM8nopwkqj4W5kF82yAP5BBQmA6Kzmf8nH/SrQdYbxwjoft57olqopFdFWLECfUVfDfbj2MmglmHy7wsNAw==</xenc:CipherValue>
                                </xenc:CipherData>
                            </xenc:EncryptedData>
                        </saml2:EncryptedAttribute>
                        <saml2:EncryptedAttribute>
                            <xenc:EncryptedData Type="http://www.w3.org/2001/04/xmlenc#Element"
                                xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                <xenc:EncryptionMethod
                                    Algorithm="http://www.w3.org/2001/04/xmlenc#aes256-cbc"
                                    xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" />
                                <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                                    <xenc:EncryptedKey Recipient="NL86ZZZ405309340000"
                                        xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                        <xenc:EncryptionMethod
                                            Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <ds:DigestMethod
                                                Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"
                                                xmlns:ds="http://www.w3.org/2000/09/xmldsig#" />
                                        </xenc:EncryptionMethod>
                                        <xenc:CipherData
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <xenc:CipherValue>
                                                Y88qOwbyGI6crIsvKW673YT7nSqMSDnI4+TdzHiOHOurzO5IHMzxVH+x8FbKnAndhdS8IcMcdlu2lhPqQ0sa0wegW+o4GEjPbI21+c1iXEOh03ke2/sdWHRBQwxezW96CqM9GTDL4YqzdRbSF1jO2KQkHgtBTZrBOybOqXq5g33EWwXl24RDYhuQp7pYROJGtc2HzL4IaL6hz3LM3LEO6Pp/JqXRfzXnt0wXxNKCj2Z2V//ftjpWFqytsT9l2qwjDhqa079LKwVYNbWTln0DRZvZRYmmUMoDNEFpA62zcFiA6ERVM9p64azGbSr7F4Ub+jkn9YHjL1lZiQtSLrCPvw==</xenc:CipherValue>
                                        </xenc:CipherData>
                                    </xenc:EncryptedKey>
                                </ds:KeyInfo>
                                <xenc:CipherData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                    <xenc:CipherValue>
                                        VNXGZ312VVtJAyEqECBXGoyzoHlO1fNfGk5e6gulvNbAcYd2ULHdZpMZxB+IH9+V1qIPoyX1fEwQ5iKlGuYuSRjjXKyl8QdWLi4+fyZqMTg6v9Vxej5Ma92Fw6+K1KsFQfeq171h136KVHUhP+HpyaiZq3Z1/2Qp0DLZ/xInJGD8sa3vdrwyttKIVvZOYHGDLL3gTxhRHXRuOJ/09rFPUVgssWsLtEMSuUIsTnRAfvTP1fZi/ZNqxKQXDMSeB4OIZ8TBXSCHWwnfWTT16y71cQ==</xenc:CipherValue>
                                </xenc:CipherData>
                            </xenc:EncryptedData>
                        </saml2:EncryptedAttribute>
                        <saml2:EncryptedAttribute>
                            <xenc:EncryptedData Type="http://www.w3.org/2001/04/xmlenc#Element"
                                xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                <xenc:EncryptionMethod
                                    Algorithm="http://www.w3.org/2001/04/xmlenc#aes256-cbc"
                                    xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" />
                                <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                                    <xenc:EncryptedKey Recipient="NL86ZZZ405309340000"
                                        xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                        <xenc:EncryptionMethod
                                            Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <ds:DigestMethod
                                                Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"
                                                xmlns:ds="http://www.w3.org/2000/09/xmldsig#" />
                                        </xenc:EncryptionMethod>
                                        <xenc:CipherData
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <xenc:CipherValue>
                                                Dw5v0+y6KclqA3NfHgzvfA4WurkzDdpKQs8oGJ0EinnhVnWbjunLYlCV8c2mflMWFYwU+LdRKXkdvffYUdK/tZmjTtULPZbGAyEHO8sQIJjICnbzkvQtOHUg95hnHR1Ox6T5vtAX5IYSMwPefdfsToZpxJagOyD0qKsC0DPlrNaUZcJtsKf3/O9TYcqUyybK+nvbpJ/h+NEA+3c1tSbU3330kXTJv9NJP8LtCd9CbJMCcEwYvHj8CX3sytbh9N6zqjoUqUSfgtzqpdc2Vp5vJE38L2h/gK4BKxvoRwZ52BAEd5h+0c7XYy5T2Q0SK0Ybt22PPSKRcDO/LCKyYjOsSg==</xenc:CipherValue>
                                        </xenc:CipherData>
                                    </xenc:EncryptedKey>
                                </ds:KeyInfo>
                                <xenc:CipherData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                    <xenc:CipherValue>
                                        dtFnR7R3DzGJ83J6DROO4SC/hPzv/zCzrac3liDnlbIsKXTjjBJOKwdGMVIzAGFA780YMDbuqMabBANFxNAPqhG3R4TF5gsZ9OpOe454Ue+a0jwTLcwtr9OI+sbGQiKENa4DwmGDPPhmji0kA2bxu1D0r4K72XIw7IqCebigS8IdBb1egegMZBztE0kHLnrKBZFWngC+Cv9aPhqAx+Iuo5ncXKAd9FsUqIZOb8KEEYbV/EzEizZfh8TRqAg63/x9xUvy73Wi493ZJ1TVvnQcfQ==</xenc:CipherValue>
                                </xenc:CipherData>
                            </xenc:EncryptedData>
                        </saml2:EncryptedAttribute>
                        <saml2:EncryptedAttribute>
                            <xenc:EncryptedData Type="http://www.w3.org/2001/04/xmlenc#Element"
                                xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                <xenc:EncryptionMethod
                                    Algorithm="http://www.w3.org/2001/04/xmlenc#aes256-cbc"
                                    xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" />
                                <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                                    <xenc:EncryptedKey Recipient="NL86ZZZ405309340000"
                                        xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                        <xenc:EncryptionMethod
                                            Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <ds:DigestMethod
                                                Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"
                                                xmlns:ds="http://www.w3.org/2000/09/xmldsig#" />
                                        </xenc:EncryptionMethod>
                                        <xenc:CipherData
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <xenc:CipherValue>
                                                ZnpI86VSd71BuNX/UYrBbsUs5OyKIPT5HLVk4C7iM1w/1681nOudq4OiQwXucRkOS8hFhVrGe2X4rYz43H/0Gl8h/IchhoOrUQ5VsxE8fiVKvx7HkrFcwN3GPbp0xLGFBTD2W5hJCUxOMqivqJi840Y7hEvW5lxaEBAvH4gzsJBj1FUtzmC4QB6eL3JRD6+Nb2x6bHnJRfmXCtnM2ogicIy6vmazwbhYDGS4XLtqkpU4NVMLRgkbESDtJV5qG/LEJVdC00sFOW0Gu8I9JwShlGCEKVVM4NXevtQfViuvK4jTH7+0Foee60Fc4tiikSv1AW6cuK+ncSxZwnzcu8RNkg==</xenc:CipherValue>
                                        </xenc:CipherData>
                                    </xenc:EncryptedKey>
                                </ds:KeyInfo>
                                <xenc:CipherData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                    <xenc:CipherValue>
                                        skDZ13i+XSsa2vgqRMmFQdjyACLMxpiFiCXfi7+qc2WFukFrvYlVbmDA1qQCIATmwaBdhlO4i9Z0jOAGqpDHCET/TKIXqXh2dbV1Y9YCKAxGR2mqPdjMusGpNePf03YsPDfyVt7ZhWhCf2r9xLmz6YJArRB3DFTkHXu2F+iyuV4KPQAr/va2Ej9qUrdRaV8ERCSnV6FWG15XJxuwfGEsnPcWLShp1ySdbtrcL0cxtUJkwFUWCaiW+bgAReX+HenehGWnpUNCn4rc1bQivJptCA==</xenc:CipherValue>
                                </xenc:CipherData>
                            </xenc:EncryptedData>
                        </saml2:EncryptedAttribute>
                        <saml2:EncryptedAttribute>
                            <xenc:EncryptedData Type="http://www.w3.org/2001/04/xmlenc#Element"
                                xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                <xenc:EncryptionMethod
                                    Algorithm="http://www.w3.org/2001/04/xmlenc#aes256-cbc"
                                    xmlns:xenc="http://www.w3.org/2001/04/xmlenc#" />
                                <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
                                    <xenc:EncryptedKey Recipient="NL86ZZZ405309340000"
                                        xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                        <xenc:EncryptionMethod
                                            Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p"
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <ds:DigestMethod
                                                Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"
                                                xmlns:ds="http://www.w3.org/2000/09/xmldsig#" />
                                        </xenc:EncryptionMethod>
                                        <xenc:CipherData
                                            xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                            <xenc:CipherValue>
                                                QkaBfwTuXor2AMqKwGRm5yfMjUGbYLt4HHN/dMqS6Z+bSVxIblEdV0uWA8j0ty5xZPmjLuPwSgvMe/NEATVYZGrZ0f0L+TIU+c/rBjBrRZbXFAjjWN9f3ldsoedv2gomiB1Smsf8fjS+3EZPz6hHnA/LBgE/UqZEoP45ABh0xNYoqUCoGKFAAhhE/zmxczGb5XRcl27WR0k8nqnMsMzBctndSf/DoCPnLHuqzMS4ZDdqJMBZIyTQafUizGJUFsyEOV3cfL2IN773/C0lu2Cb6zPJ7+I5YeeqFarXBEWOpco/A5GgeZEJtxzaaEHbehrQZzJTYC435t1l6Jv0FwiJbw==</xenc:CipherValue>
                                        </xenc:CipherData>
                                    </xenc:EncryptedKey>
                                </ds:KeyInfo>
                                <xenc:CipherData xmlns:xenc="http://www.w3.org/2001/04/xmlenc#">
                                    <xenc:CipherValue>
                                        gxMvg7BmC6xxrd1lvF5/gvCXO29e6zLFTtsQe/rDvytusnKZzJPdzYajGogw0NvxXFEeht8rbczod0ZmMN7it0CXwleGGelm8eIO2pJ35QOmD7R24Hx6kpt2AEVEjZDxRsPnacxT5sHsPmPywZic5rLSCQARJm9Zuat4aq/AeMJF+gfR/IGakSqwDi2uAKTAT8I6Gqv2Svvdaf2alXnOzw2G8FozkieK7sd2JJ0rQvJSCTuqRfwMQEEtUOOMWG1YSeourulJDrPBD6bgX1nveA0sUwckC/R/mIf5yKF0lrRA1jtndw4BWAPqGrGligK1d1ZFO/rFAN1g/iJ46YFmdedNcGebheOAneuwFLuUj62r/Eqj1BFsrWtuzatP7bbqDKJvTqTkPcM7uUvRNTm0qg==</xenc:CipherValue>
                                </xenc:CipherData>
                            </xenc:EncryptedData>
                        </saml2:EncryptedAttribute>
                    </saml2:AttributeStatement>
                </saml2:Assertion>
            </saml2p:Response>
        </awidxma:container>
    </awidxma:Transaction>
    <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
        <SignedInfo>
            <CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" />
            <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" />
            <Reference URI="">
                <Transforms>
                    <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" />
                    <Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" />
                </Transforms>
                <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" />
                <DigestValue>lw8EtKWnY3QBKIwSsV2NpcmJ4xmQ98Kw6m/5gZJ+1P4=</DigestValue>
            </Reference>
        </SignedInfo>
        <SignatureValue>
            jyf/MhqPdRULMNSlw6EKI5xHP7o0u1qKU/WUwQEeratGvRMsqCxm342tjfW0j9V2ddHy6ndz3MoZc3KUHhSgR/pXSwV+R2T0RH7rLxBhvLHVE8PZhL2qNRnvf1VoFLQusZbM2XVn3i0ts/vajIv02qBhihHqSyAYaao+mGH3y6zqn7m3ZRp5gBAbt4Tg+zp2qkpfsw2ec4DJUNZebwP34gzYB3/jjlGp8ySU/QZddzELCl6TKCs9WF4T3KTt1ymybcOMczf3pwHDA55LhZWm6nXxsCFZePi7V/vU/cEv/iwhW/LW5URAfe4W+fY9EGc6jr8qKSS2usFqbvadgz6SdQ==</SignatureValue>
        <KeyInfo>
            <KeyName>A7C247C4A2F795BBD0BDFB5C56ED4CDC86B60368</KeyName>
        </KeyInfo>
    </Signature>
</awidxma:AcquirerStatusRes>`;

// console.log(JSON.stringify(fastXmlParser.parse(xml), null, 2))

// console.log(JSON.stringify(parser.parse(xml), null, 2))

class Parser {
  private lexer: Lexer;

  private declaredEntities: DeclaredEntities;

  constructor(input: string) {
    this.lexer = new Lexer(input);

    this.declaredEntities = { ...Entities };
  }

  get index() {
    return this.lexer.index;
  }

  get col() {
    return this.lexer.col;
  }

  get line() {
    return this.lexer.line;
  }

  private reset() {
    this.declaredEntities = { ...Entities };
  }

  private isInTag = () => {
    return this.lexer.assert(
      ({ type }) =>
        type !== 'RIGHT_ANGLE_BRACKET' && type !== 'SLASH' && type !== 'TENARY'
    );
  };

  private isTextContent = ({ type }: Token) => {
    switch (type) {
      case 'TEXT':
      case 'WHITE_SPACE':
      case 'NEW_LINE':
        return true;
      default:
        return false;
    }
  };

  private isXMLDelaration(): boolean {
    const { lexer } = this;

    const { index, col, line } = lexer;

    if (!lexer.assertType('LEFT_ANGLE_BRACKET')) return false;

    lexer.consumeLeftAngleBracket();

    lexer.consumeWhiteSpace();

    if (!lexer.assertType('TENARY')) {
      lexer.index = index;
      lexer.col = col;
      lexer.line = line;

      return false;
    }

    lexer.consume();

    lexer.consumeWhiteSpace();

    const isXML =
      lexer.peekChar() === 'x' &&
      lexer.peekChar(1) === 'm' &&
      lexer.peekChar(2) === 'l';

    lexer.index = index;
    lexer.col = col;
    lexer.line = line;

    return isXML;
  }

  private parseAttributeValue(quote: Token) {
    const { lexer } = this;

    let output = '';

    while (lexer.hasData()) {
      const token = lexer.peek();

      if (token.type === quote.type) break;

      if (lexer.assertType('LEFT_ANGLE_BRACKET', 'RIGHT_ANGLE_BRACKET'))
        throw Error(
          `Unescaped "${token.value}" not allowed in attributes values.`
        );

      if (token.type === 'APOSTROPHE') output += this.parseEntityReference();

      output += lexer.next().value;
    }

    return output;
  }

  private isEndTag(): boolean {
    const { lexer } = this;

    const { index, line, col } = lexer;

    if (!lexer.assertType('LEFT_ANGLE_BRACKET')) return false;

    lexer.consume('LEFT_ANGLE_BRACKET');

    lexer.consumeWhiteSpace();

    if (!lexer.assertType('SLASH')) {
      lexer.index = index;
      lexer.col = col;
      lexer.line = line;

      return false;
    }

    lexer.consume('SLASH');

    lexer.consumeWhiteSpace();

    this.parseName();

    lexer.consumeWhiteSpace();

    lexer.consume('RIGHT_ANGLE_BRACKET');

    lexer.index = index;
    lexer.col = col;
    lexer.line = line;

    return true;
  }

  private parseEndTag(tagName: string) {
    const { lexer } = this;

    lexer.consume('LEFT_ANGLE_BRACKET');

    lexer.consumeWhiteSpace();

    lexer.consume('SLASH');

    lexer.consumeWhiteSpace();

    const name = this.parseName();

    if (name !== tagName)
      throw Error(`Unexpected closing tag: ${name} expected: ${tagName}`);

    lexer.consumeWhiteSpace();

    lexer.consume('RIGHT_ANGLE_BRACKET');
  }

  private parseAttributes(): Attributes {
    const attributes = {};

    while (this.isInTag()) {
      const attribute = this.parseAttribute();

      attributes[attribute.name] = attribute;
    }

    return attributes;
  }

  private parseAttribute() {
    const { lexer } = this;

    lexer.consumeWhiteSpace();

    const name = this.parseName();

    lexer.consumeWhiteSpace();

    lexer.consume('EQUAL');

    lexer.consumeWhiteSpace();

    const quote = lexer.consume('SINGLE_QUOTE', 'DOUBLE_QUOTE');

    const start = lexer.index;

    const value = this.parseAttributeValue(quote);

    const end = lexer.index;

    lexer.consume(quote.type);

    lexer.consumeWhiteSpace();

    return {
      type: 'attribute',
      raw: lexer.source.substring(start, end),
      name,
      value
    };
  }

  private parseName() {
    const { lexer } = this;

    return `${lexer.consume('NAME_START').value}${lexer.consumeWhile((token) => token.type === 'NAME' || token.type === 'NAME_START')}`;
  }

  private parseEntityReference(): string {
    const { lexer } = this;

    lexer.consume('APOSTROPHE');

    const name = this.parseName();

    lexer.consume('SEMI');

    const value = this.declaredEntities[`&${name};`];

    if (value === undefined) throw Error(`Entity "${name}" is not defined.`);

    return value;
  }

  private parseElement() {
    const { lexer } = this;

    const start = lexer.index;

    lexer.consume('LEFT_ANGLE_BRACKET');

    lexer.consumeWhiteSpace();

    const name = this.parseName();

    const attrs = this.parseAttributes();

    const isEmptyTag = lexer.assertType('SLASH');

    if (isEmptyTag) lexer.advance();

    lexer.consume('RIGHT_ANGLE_BRACKET');

    const children = [];

    if (!isEmptyTag) {
      while (lexer.hasData() && !this.isEndTag())
        children.push(this.parseNode());

      this.parseEndTag(name);
    }

    const end = lexer.index;

    return {
      type: 'tag',
      name,
      attrs,
      children,
      get outerHTML() {
        return lexer.source.substring(start, end);
      }
    };
  }

  private parseTextNode() {
    const value = this.lexer.consumeWhile(this.isTextContent);

    return {
      type: 'text',
      name: '#text',
      value
    };
  }

  private parseXMLDeclaration() {
    const { lexer } = this;

    const start = lexer.index;

    lexer.consumeLeftAngleBracket();

    lexer.consumeWhiteSpace();

    lexer.consume('TENARY');

    lexer.consumeChar('x');
    lexer.consumeChar('m');
    lexer.consumeChar('l');

    lexer.consumeWhiteSpace();

    const attrs = this.parseAttributes();

    lexer.consumeWhiteSpace();

    lexer.consume('TENARY');

    lexer.consumeWhiteSpace();

    lexer.consumeRightAngleBracket();

    return {
      type: 'xmlDeclaration',
      name: '#declaration',
      version: attrs.version,
      standalone: attrs.standalone,
      attrs
    };
  }

  private parseNode() {
    const { type, value } = this.lexer.peek();

    switch (type) {
      case 'LEFT_ANGLE_BRACKET':
        return this.parseElement();
      case 'WHITE_SPACE':
      case 'NEW_LINE':
      case 'TEXT':
        return this.parseTextNode();
      default:
        throw Error(`Unexpected character: ${value}`);
    }
  }

  private parseDocument() {
    const { lexer } = this;

    lexer.consumeWhiteSpace();

    const xmlDeclaration = this.isXMLDelaration()
      ? this.parseXMLDeclaration()
      : null;

    lexer.consumeWhiteSpace();

    const root = this.parseNode();

    const document = {
      type: 'document',
      name: '#document',
      xmlDeclaration,
      docType: null,
      root
    };

    lexer.consumeWhiteSpace();

    console.log(JSON.stringify(document, null, 2));

    return document;
  }

  parse() {
    return this.parseDocument();
  }
}

const doc = `
<?xml version="1.0" encoding="UTF-8"?>
<\n\rElement
  attr="foo bar🧐"
>
  hoi
  <Foo bar="&">
    Hallo dit
    is
    tekst
  </Foo>
</Element>`;

// const parser = new Parser(doc)

// console.log(JSON.stringify(parser.parse(), null, 2))

// console.log(JSON.stringify(fastXmlParser.parse(doc), null, 2))

// parser.parse()

const parser = new XMLParser();

const result = parser.toJSObject(
  parser.parse(`<ns3:Directory>
<ns3:directoryDateTimestamp>2022-10-04T07:57:00.000Z</ns3:directoryDateTimestamp>
<ns3:Country>
    <ns3:countryNames>Nederland</ns3:countryNames>
    <ns3:Issuer>
        <ns3:issuerID>ABNANL2A</ns3:issuerID>
        <ns3:issuerName>ABN AMRO</ns3:issuerName>
    </ns3:Issuer>
    <ns3:Issuer>
        <ns3:issuerID>ASNBNL21</ns3:issuerID>
        <ns3:issuerName>ASN Bank</ns3:issuerName>
    </ns3:Issuer>
    <ns3:Issuer>
        <ns3:issuerID>BUNQNL2A</ns3:issuerID>
        <ns3:issuerName>bunq</ns3:issuerName>
    </ns3:Issuer>
    <ns3:Issuer>
        <ns3:issuerID>INGBNL2A</ns3:issuerID>
        <ns3:issuerName>ING</ns3:issuerName>
    </ns3:Issuer>
    <ns3:Issuer>
        <ns3:issuerID>RABONL2U</ns3:issuerID>
        <ns3:issuerName>Rabobank</ns3:issuerName>
    </ns3:Issuer>
    <ns3:Issuer>
        <ns3:issuerID>RBRBNL21</ns3:issuerID>
        <ns3:issuerName>RegioBank</ns3:issuerName>
    </ns3:Issuer>
    <ns3:Issuer>
        <ns3:issuerID>SNSBNL2A</ns3:issuerID>
        <ns3:issuerName>SNS</ns3:issuerName>
    </ns3:Issuer>
</ns3:Country>
<ns3:Country>
    <ns3:countryNames>Nederland</ns3:countryNames>
    <ns3:Issuer>
        <ns3:issuerID>ABNANL2A</ns3:issuerID>
        <ns3:issuerName>ABN AMRO</ns3:issuerName>
    </ns3:Issuer>
    <ns3:Issuer>
        <ns3:issuerID>ASNBNL21</ns3:issuerID>
        <ns3:issuerName>ASN Bank</ns3:issuerName>
    </ns3:Issuer>
    <ns3:Issuer>
        <ns3:issuerID>BUNQNL2A</ns3:issuerID>
        <ns3:issuerName>bunq</ns3:issuerName>
    </ns3:Issuer>
    <ns3:Issuer>
        <ns3:issuerID>INGBNL2A</ns3:issuerID>
        <ns3:issuerName>ING</ns3:issuerName>
    </ns3:Issuer>
    <ns3:Issuer>
        <ns3:issuerID>RABONL2U</ns3:issuerID>
        <ns3:issuerName>Rabobank</ns3:issuerName>
    </ns3:Issuer>
    <ns3:Issuer>
        <ns3:issuerID>RBRBNL21</ns3:issuerID>
        <ns3:issuerName>RegioBank</ns3:issuerName>
    </ns3:Issuer>
    <ns3:Issuer>
        <ns3:issuerID>SNSBNL2A</ns3:issuerID>
        <ns3:issuerName>SNS</ns3:issuerName>
    </ns3:Issuer>
</ns3:Country>
</ns3:Directory>`)
);

console.log(result);

// const samlResponse = result["awidxma:AcquirerStatusRes"]["awidxma:Transaction"]["awidxma:container"]["saml2p:Response"]

// const assertion = result["awidxma:AcquirerStatusRes"]["awidxma:Transaction"]["awidxma:container"]["saml2p:Response"]["saml2:Assertion"]

// const signedInfo = assertion['ds:Signature']["ds:SignedInfo"]

// const signatureValue = assertion['ds:Signature']["ds:SignatureValue"]

// const keyInfo = assertion['ds:Signature']['ds:KeyInfo']

// const certificate = keyInfo["ds:X509Data"]["ds:X509Certificate"]

// console.log({cert: `-----BEGIN CERTIFICATE-----\n${certificate.replace(/[\t ]*/g, '')}\n-----END CERTIFICATE-----\n` })

// const x509Certificate = new X509Certificate(`-----BEGIN CERTIFICATE-----\n${certificate.replace(/[\t ]*/g, '')}\n-----END CERTIFICATE-----\n`)

// console.log({ cert: x509Certificate.toString() })

// console.log(x509Certificate)

// console.log(JSON.stringify(result, null, 2))

// const lex = new Lex(doc)

// for (const tok of lex) console.log(tok)
