import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      // authorization: {
      //   params: {
      //     prompt: 'login',
      //     access_type: 'online',
      //   },
      // },
      // authorization 파라미터를 통해 로그인 프롬프트를 강제함
      // access_type을 offline으로 설정하여 리프레시 토큰을 받을 수 있도록 설정함
      // 이 설정은 사용자가 로그인할 때마다 인증을 요구함
      // 예를 들어, access_type을 online으로 설정하면 사용자가 이미 로그인한 경우
      // 자동으로 인증을 처리할 수 있음
      // 하지만 이 경우 리프레시 토큰을 사용할 수 없게 됨
      // 따라서 서비스의 요구 사항에 따라 적절한 설정을 선택해야 함
      // profile: (profile) => {
      //   return {
      //     id: profile.id.toString(),
      //     name: profile.properties.nickname,
      //     email: profile.kakao_account.email || null,
      //     image: profile.properties.profile_image || null,
      //   };
      //   // Kakao 프로필 정보를 사용자 객체로 변환
      // },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    // jwt로 세션을 관리함
    // NextAuth가 로그인 시 발급한 JWT를 브라우저의 HTTPOnly 쿠키에 저장하고,
    // 클라이언트는 이 쿠키를 통해 인증된 세션을 유지함
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        console.log('JWT Callback - User:', user);
        // user 객체가 존재하면 토큰에 사용자 ID를 추가함
        // 이 ID는 로그인 시에만 존재하며, 이후에는 토큰에 저장된 정보만 사용됨
        // 이 토큰은 클라이언트와 서버 간의 인증을 유지하는 데 사용됨
        console.log('JWT Callback - Token:', token);
      }
      return token;
      // JWT가 생성되거나 업데이트될 때 호출되며, 반환하는 값은 암호화되어 쿠키에 저장됩니다.
      // user 객체는 로그인 시에만 존재하며, 이후에는 토큰에 저장된 정보만 사용됨
      // 이 토큰은 클라이언트와 서버 간의 인증을 유지하는 데 사용됨
    },
    async session({ session, token }) {
      if (token) {
        if (session.user) {
          session.user.id = token.id;
        }
      }
      return session;
      // jwt 콜백이 반환하는 token을 받아, 세션이 확인될 때마다 호출되며, 반환하는 값은 클라이언트에서 확인할 수 있습니다.
    },
  },
});

export { handler as GET, handler as POST }; 