import type { ComponentDef, CanvasItem } from '~/types/component'

export const useElements = () => {
    // Field 컴포넌트
  const fieldComponents: ComponentDef[] = [
    {
      id: 'heading1',
      name: '제목 H1',
      description: '섹션의 큰 제목',
      icon: 'heroicons:h1',
      type: 'heading1',
      defaultProps: {
        data: {
          text: '큰 제목 텍스트'
        },
        styles: {
          width: '100%',
          height: '48px',
          fontSize: 32
        }
      }
    },
    {
      id: 'heading2',
      name: '제목 H2',
      description: '섹션의 중간 제목',
      icon: 'heroicons:h2',
      type: 'heading2',
      defaultProps: {
        data: {
          text: '중간 제목 텍스트'
        },
        styles: {
          width: '100%',
          height: '36px',
          fontSize: 24
        }
      }
    },
    {
      id: 'heading3',
      name: '제목 H3',
      description: '섹션의 작은 제목',
      icon: 'heroicons:h3',
      type: 'heading3',
      defaultProps: {
        data: {
          text: '작은 제목 텍스트'
        },
        styles: {
          width: '100%',
          height: '28px',
          fontSize: 18
        }
      }
    },
    {
      id: 'spacer',
      name: '여백',
      description: '위아래 간격을 주는 빈 공간',
      icon: 'pi pi-arrows-v',
      type: 'spacer',
      defaultProps: {
        data: {},
        styles: {
          width: '100%',
          height: '16px'
        }
      }
    },
    {
      id: 'divider',
      name: '구분선',
      description: '섹션을 나누는 얇은 선',
      icon: 'pi pi-minus',
      type: 'divider',
      defaultProps: {
        data: {},
        styles: {
          width: '100%',
          height: '1px'
        }
      }
    },
    {
      id: 'image',
      name: '이미지',
      description: '이미지/썸네일 자리',
      icon: 'pi pi-image',
      type: 'image',
      defaultProps: {
        data: {
          alt: '이미지 설명'
        },
        styles: {
          width: '100%',
          height: '100px'
        }
      }
    }
  ]

  // Form 컴포넌트
  const formComponents: ComponentDef[] = [
    {
      id: 'inputText',
      name: '아이디 입력',
      description: '아이디 입력 필드',
      icon: 'pi pi-user',
      type: 'inputText',
      defaultProps: {
        data: {
          label: '아이디 레이블',
          placeholder: '입력하세요...'
        },
        styles: {
          width: '100%',
          height: '40px'
        }
      }
    },
    {
      id: 'inputPassword',
      name: '비밀번호 입력',
      description: '비밀번호 입력 필드',
      icon: 'pi pi-lock',
      type: 'inputPassword',
      defaultProps: {
        data: {
          label: '비밀번호',
          placeholder: '비밀번호를 입력하세요'
        },
        styles: {
          width: '100%',
          height: '40px'
        }
      }
    },
    {
      id: 'inputEmail',
      name: '이메일 입력',
      description: '이메일 주소 입력 필드',
      icon: 'pi pi-envelope',
      type: 'inputEmail',
      defaultProps: {
        data: {
          label: '이메일',
          placeholder: 'example@email.com'
        },
        styles: {
          width: '100%',
          height: '40px'
        }
      }
    },
    {
      id: 'inputDate',
      name: '날짜 선택',
      description: '날짜를 선택하는 필드',
      icon: 'pi pi-calendar',
      type: 'inputDate',
      defaultProps: {
        data: {
          label: '날짜',
          placeholder: 'yy.mm.dd'
        },
        styles: {
          width: '100%',
          height: '40px'
        }
      }
    },
    {
      id: 'inputTime',
      name: '시간 선택',
      description: '시간만 선택하는 필드',
      icon: 'pi pi-clock',
      type: 'inputTime',
      defaultProps: {
        data: {
          label: '시간',
          placeholder: 'hh:ss'
        },
        styles: {
          width: '100%',
          height: '40px'
        }
      }
    },
    
    {
      id: 'inputUrl',
      name: 'URL 입력',
      description: '웹 주소 입력 필드',
      icon: 'pi pi-link',
      type: 'inputUrl',
      defaultProps: {
        data: {
          label: 'URL',
          placeholder: 'https://example.com'
        },
        styles: {
          width: '100%',
          height: '40px'
        }
      }
    },
    
    {
      id: 'radio',
      name: '라디오 버튼',
      description: '라디오 버튼 선택 필드',
      icon: 'pi pi-circle',
      type: 'radio',
      defaultProps: {
        data: {
          label: '라디오 레이블',
          options: ['옵션 1', '옵션 2', '옵션 3'],
          selected: '옵션 1'
        },
        styles: {
          width: '100%',
          height: '20px'
        }
      }
    },
    {
      id: 'textarea',
      name: '텍스트 입력',
      description: '텍스트 입력 필드',
      icon: 'pi pi-align-justify',
      type: 'textarea',
      defaultProps: {
        data: {
          label: '텍스트 레이블',
          content: ''
        },
        styles: {
          width: '100%',
          height: '120px',
          fontSize: 14
        }
      }
    },
    {
      id: 'select',
      name: '선택 상자',
      description: '옵션을 선택하는 드롭다운',
      icon: 'pi pi-list',
      ready: false,
      type: 'select',
      defaultProps: {
        data: {
          label: '선택',
          placeholder: '선택하세요',
          options: ['옵션 1', '옵션 2', '옵션 3']
        },
        styles: {
          width: '100%',
          height: '40px'
        }
      }
    },
    {
      id: 'checkbox',
      name: '체크박스',
      description: '체크박스 선택 필드',
      icon: 'pi pi-check-square',
      ready: false,
      type: 'checkbox',
      defaultProps: {
        data: {
          label: '체크박스 레이블',
          checked: false
        },
        styles: {
          width: '100%',
          height: '40px'
        }
      }
    },
    {
      id: 'toggleSwitch',
      name: '토글 스위치',
      description: '켜기/끄기 토글 스위치',
      icon: 'pi pi-sliders-h',
      ready: false,
      type: 'toggleSwitch',
      defaultProps: {
        data: {
          label: '토글 레이블',
          checked: false
        },
        styles: {
          width: '100%',
          height: '40px'
        }
      }
    }
  ]

  const additionalFieldComponents: ComponentDef[] = [
    {
      id: 'button',
      name: '버튼',
      description: '왼쪽 정렬 작은 버튼',
      icon: 'pi pi-stop',
      type: 'button',
      defaultProps: {
        data: {
          label: '버튼 레이블',
          text: '버튼',
          severity: 'primary',
          outlined: false
        },
        styles: {
          width: '100px',
          height: '40px',
          fontSize: 14
        }
      }
    },
    {
      id: 'prevNext',
      name: '이전/다음 버튼',
      description: '좌우 이전/다음 버튼',
      icon: 'pi pi-arrow-right-arrow-left',
      type: 'prevNext',
      defaultProps: {
        data: {
          prevText: '이전 페이지',
          nextText: '다음 페이지'
        },
        styles: {
          width: '100px',
          height: '40px'
        }
      }
    },
    {
      id: 'group',
      name: '그룹',
      description: '컴포넌트 그룹화',
      icon: 'pi pi-folder',
      ready: false,
      type: 'group',
      defaultProps: {
        data: {
          title: '그룹 제목',
          items: []
        },
        styles: {}
      }
    },
    {
      id: 'table',
      name: '테이블',
      description: '간단한 표 레이아웃',
      icon: 'pi pi-table',
      ready: false,
      type: 'table',
      defaultProps: {
        data: {
          columns: ['컬럼 1', '컬럼 2', '컬럼 3'],
          rows: [['데이터 1', '데이터 2', '데이터 3']]
        },
        styles: {}
      }
    },
    {
      id: 'grid',
      name: '그리드 섹션',
      description: '여러 요소를 배치',
      icon: 'pi pi-th-large',
      ready: false,
      type: 'grid',
      defaultProps: {
        data: {
          columns: 2,
          gap: '1rem'
        },
        styles: {}
      }
    }
  ]

  const allFieldComponents: ComponentDef[] = [
    ...fieldComponents,
    ...additionalFieldComponents
  ]

  const components: ComponentDef[] = [
    ...allFieldComponents,
    ...formComponents
  ]

  const componentNames: Record<string, string> = {
    heading1: '제목 H1',
    heading2: '제목 H2',
    heading3: '제목 H3',
    spacer: '여백',
    divider: '구분선',
    textarea: '텍스트 입력',
    image: '이미지',
    button: '버튼',
    inputText: '아이디 입력',
    inputPassword: '비밀번호 입력',
    inputEmail: '이메일 입력',
    inputDate: '날짜 선택',
    inputTime: '시간 선택',
    select: '선택 상자',
    inputUrl: 'URL 입력',
    checkbox: '체크박스',
    radio: '라디오 버튼',
    toggleSwitch: '토글 스위치',
    prevNext: '이전/다음 버튼',
    grid: '그리드 섹션',
    group: '그룹',
    table: '테이블'
  }

  const componentIcons: Record<string, string> = {
    heading1: 'heroicons:h1',
    heading2: 'heroicons:h2',
    heading3: 'heroicons:h3',
    spacer: 'pi pi-arrows-v',
    divider: 'pi pi-minus',
    textarea: 'pi pi-align-justify',
    image: 'pi pi-image',
    button: 'pi pi-stop',
    inputText: 'pi pi-user',
    inputPassword: 'pi pi-lock',
    inputEmail: 'pi pi-envelope',
    inputDate: 'pi pi-calendar',
    inputTime: 'pi pi-clock',
    select: 'pi pi-list',
    inputUrl: 'pi pi-link',
    checkbox: 'pi pi-check-square',
    radio: 'pi pi-circle',
    toggleSwitch: 'pi pi-sliders-h',
    prevNext: 'pi pi-arrow-right-arrow-left',
    grid: 'pi pi-th-large',
    group: 'pi pi-folder',
    table: 'pi pi-table'
  }

  const severityOptions: string[] = ['primary', 'secondary', 'success', 'info', 'warn', 'danger']

  // 컴포넌트 타입에 따른 아이콘 반환
  const getComponentIcon = (type: string): string => {
    return componentIcons[type] || 'pi pi-box'
  }

  // 컴포넌트 타입에 따른 이름 반환
  const getComponentName = (type: string): string => {
    return componentNames[type] || type
  }

  // 캔버스 아이템의 표시 레이블 반환
  const getComponentLabel = (item: CanvasItem): string => {
    const name = getComponentName(item.type)
    if (['heading1', 'heading2', 'heading3'].includes(item.type)) {
      return item.props.data?.text || name
    }
    if (['button', 'inputText', 'inputPassword', 'inputEmail', 'inputDate', 'inputTime', 'select', 'textarea', 'inputUrl', 'checkbox', 'radio', 'toggleSwitch'].includes(item.type)) {
      return item.props.data?.label || name
    }
    return name
  }

  // 고유 ID 생성
  const generateUid = (): string => {
    return Math.random().toString(36).substring(2, 9)
  }

  return {
    components,
    fieldComponents: allFieldComponents,
    formComponents,
    componentNames,
    componentIcons,
    severityOptions,
    getComponentIcon,
    getComponentName,
    getComponentLabel,
    generateUid
  }
}