module.exports = [
    {
      files: ["**/*.js", "**/*.jsx"],
      rules: {
        // 코드 포맷팅
        "semi": "error",                    // 세미콜론 필수
        "quotes": ["error", "single"],      // 작은따옴표 사용
        "indent": ["error", 2],             // 들여쓰기 2칸
        
        // 변수 사용
        "prefer-const": "error",            // const 사용 권장
        "no-unused-vars": "warn",           // 미사용 변수 경고
        "no-var": "error",                  // var 사용 금지
        
        // 코드 품질
        "no-console": "warn",               // console 사용 경고
        "eqeqeq": "error",                  // === 연산자 사용
        "no-multiple-empty-lines": ["error", { "max": 1 }],
        
        // ES6+ 기능
        "prefer-template": "error",         // 템플릿 리터럴 사용
        "prefer-spread": "error",           // spread 연산자 사용
        "arrow-body-style": ["error", "as-needed"],
        
        // 오류 방지
        "no-throw-literal": "error",        // Error 객체만 throw
        "no-empty-function": "warn",        // 빈 함수 경고
        "array-callback-return": "error",    // 배열 메소드 return 필수
        
        // 가독성
        "max-len": ["warn", { "code": 100 }], // 줄 길이 제한
        "camelcase": "error",               // 카멜케이스 사용
        "no-nested-ternary": "error"        // 중첩 삼항연산자 금지
      }
    }
  ];
  