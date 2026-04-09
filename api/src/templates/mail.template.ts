export const passwordSetupTemplate = (fullName: string, setupUrl: string): string => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Merhaba ${fullName},</h2>
        <p>Hesabınız oluşturuldu. Şifrenizi belirlemek için aşağıdaki butona tıklayın.</p>
        <a href="${setupUrl}" style="
            background-color: #135bec;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            display: inline-block;
            margin: 16px 0;
        ">
            Şifre Oluştur
        </a>
        <p style="color: #666; font-size: 14px;">Bu link 24 saat geçerlidir.</p>
        <p style="color: #666; font-size: 14px;">Eğer bu isteği siz yapmadıysanız bu maili görmezden gelebilirsiniz.</p>
    </div>
`;