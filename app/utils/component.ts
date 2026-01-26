// 컴포넌트 타입별 기본 설정 (data + styles 통합)
interface ComponentDefaults {
  data: Record<string, any>
  styles: Record<string, any>
}

// 컴포넌트 타입별 기본 설정 반환
export const getComponentDefaults = (type: string): ComponentDefaults => {
  const defaults: Record<string, ComponentDefaults> = {
    heading1: {
      data: {},
      styles: {
        width: '100%',
        height: '48px',
        fontSize: 32
      }
    },
    heading2: {
      data: {},
      styles: {
        width: '100%',
        height: '36px',
        fontSize: 24
      }
    },
    heading3: {
      data: {},
      styles: {
        width: '100%',
        height: '28px',
        fontSize: 18
      }
    },
    button: {
      data: {},
      styles: {
        width: '100px',
        height: '40px',
        fontSize: 14
      }
    },
    inputText: {
      data: {},
      styles: {
        width: '100%',
        height: '40px'
      }
    },
    inputPassword: {
      data: {},
      styles: {
        width: '100%',
        height: '40px'
      }
    },
    inputEmail: {
      data: {},
      styles: {
        width: '100%',
        height: '40px'
      }
    },
    inputUrl: {
      data: {},
      styles: {
        width: '100%',
        height: '40px'
      }
    },
    inputDate: {
      data: {},
      styles: {
        width: '100%',
        height: '40px'
      }
    },
    inputTime: {
      data: {},
      styles: {
        width: '100%',
        height: '40px'
      }
    },
    select: {
      data: {},
      styles: {
        width: '100%',
        height: '40px'
      }
    },
    textarea: {
      data: {},
      styles: {
        width: '100%',
        height: '120px',
        fontSize: 14
      }
    },
    image: {
      data: {},
      styles: {
        width: '100%',
        height: '100px'
      }
    },
    checkbox: {
      data: {},
      styles: {
        width: '100%',
        height: '40px'
      }
    },
    toggleSwitch: {
      data: {},
      styles: {
        width: '100%',
        height: '40px'
      }
    },
    radio: {
      data: {},
      styles: {
        width: '100%',
        height: '20px'
      }
    },
    prevNext: {
      data: {},
      styles: {
        width: '100px',
        height: '40px'
      }
    },
    spacer: {
      data: {},
      styles: {
        width: '100%',
        height: '16px'
      }
    },
    divider: {
      data: {},
      styles: {
        width: '100%',
        height: '1px'
      }
    }
  }
  
  return defaults[type] || { data: {}, styles: {} }
}