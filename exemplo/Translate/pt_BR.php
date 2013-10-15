<?php
/**
 * Arquivo que contém as traduções das mensagens de erro do formulário para pt_BR
 */
$portugues = array(
        // Campo vazio
        'isEmpty' => 'Este campo não pode ser vazio',
        // AlNum 
        'alnumNotAlnum' => '"%value%" contém caracteres não alfabéticos ou digitos.',
        // Alpha
        'alphaNotAlpha' => '"%value%" contém caracteres não alfabéticos.',
        // Barcode_Ean13        
        'barcode_Ean13Invalid' => '"%value%" não é um código de barras EAN-13 válido.',
        'barcode_Ean13InvalidLength' => '"%value%" deve conter 13 caracteres.',
        'barcode_Ean13NotNumeric' => '"%value%" só pode conter números.',
        // Barcode_UpcA
        'barcode_UpcAInvalid' => '"%value%" não é um código de barras UPC-A válido',
        'barcode_UpcAInvalidLength' => '"%value%" deve conter 12 caracteres.',
        // Between
        'betweenNotBetween' => '"%value%" não está entre "%min%" e "%max%", inclusive.',
        'betweenNotBetweenStrict' => '"%value%" não está entre "%min%" e "%max%" ',
        // Captcha
        'missingValue' => 'Valor do captcha vazio.',
        'missingId' => 'Campo ID do captcha está vazio.',
        'badCaptcha' => 'Valor do captcha incorreto.',
        // Ccnum
        'ccnumLength' => '"%value%" deve conter enter 13 e 19 digitos.',
        'ccnumChecksum' => 'Algorítimo de Luhn (mod-10 checksum) falhou em "%value%".',
        // Date         
        'dateFalseFormat' => '"%value%" não está no formato necessário. DD/MM/AAAA',
        'dateInvalidDate' => '"%value%" não é uma data válida.',
        'dateNotYYYY-MM-DD' => '"%value%" não é uma data no formato AAAA-MM-DD.',
        // DbAbstract
        'dbAbstractErrorNoRecordFound' => 'Não foram localizados registros que iguais a "%value%".',
        'dbAbstractErrorRecordFound' => 'Foi localizado valor igual a "%value%".',
        // Digits       
        'digitsNotDigits' => '"%value%" não contém somente dígitos.',
        'digitsStringEmpty' => '"%value%" é um valor vazio.',
        // EmailAdress
        'emailAddressInvalidFormat' => '"%value%" não é um e-mail válido no formato nome@servidor.',
        'emailAddressInvalid' => '"%value%"  não é um e-mail válido no formato básico nome@servidor.',
        'emailAddressInvalidHostname' => '"%hostname%" não é um servidor válido para o e-mail "%value%".',
        'emailAddressInvalidMxRecord' => '"%hostname%" não aparenta ter um valor MX válido para o e-mail "%value%".',
        'emailAddressDotAtom' => '"%localPart%" não confere com formato dot-atom.',
        'emailAddressQuotedString' => '"%localPart%" não confere com o formato quoted-string.',
        'emailAddressInvalidLocalPart' => '"%localPart%" não é um nome válido para o e-mail "%value%".',
        'emailAddressLengthExceeded' => '"%value%" excede o tamanho limite.',
        // FileCount
        'fileCountTooMuch' => 'Muitos arquivos, máximo "%max%" são permitidos, mas "%count%" foram enviados.',
        'fileCountTooLess' => 'Poucos arquivos, mínimo "%min%" são esperados, mas "%count%" foram enviados.',
        // Float
        'floatNotFloat' => '""%value%"" não é um valor decimal válido.',
        'floatInvalid' => 'Tipo inválido.',
        // HostName
        'hostnameInvalid' => 'Tipo inválido, valor deve ser um texto.',
        'hostnameIpAddressNotAllowed' => '"%value%" aparenta ser um endereço IP, que não são permitidos.',
        'hostnameUnknownTld' => '"%value%" é um DNS desconhecido do modelo TLD.',
        'hostnameDashCharacter' => '"%value%" contém (-) em uma posição inválida.',
        'hostnameInvalidHostnameSchema' => '"%value%" não confere com o modelo TLD "%tld%"',
        'hostnameUndecipherableTld' => '"%value%" não tem um nome de servidor que pode ser extraído para o TLD.',
        'hostnameInvalidHostname' => '"%value%" não tem a estrutura esperada para o nome de um servidor.',
        'hostnameInvalidLocalName' => '"%value%" não é um nome de servidor local válido.',
        'hostnameLocalNameNotAllowed' => '"%value%" é um servidor local, mas não são permitidos servidores locais.',
        'hostnameCannotDecodePunycode' => '"%value%" não tem um código interpretável.',
        // InArray      
        'inArrayNotInArray' => '""%value%"" não foi encontrado nos valores permitidos.',
        // Int
        'notInt' => "'%value%' não é um valor válido.",
        'stringLengthTooLong' => "Não pode ser maior que %max% caracteres"
);

return $portugues;