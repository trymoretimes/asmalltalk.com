import React from 'react'
import ClipboardJS from 'clipboard'

import styles from './styles.css'
import api from '../../api'
import { maybeEmailAddress } from '../../utils'
import screenshot from './clip.svg'

import { SubmitStatus } from '../../constants'
import SubmitButton from '../SubmitButton'
import InputRow from '../InputRow'

import TitleBox from '../TitleBox'
import text from '../../res/i18n.json'

const LANG = window.navigator.language
const SiteEnum = {
  V2ex: 'v2ex',
  Github: 'github',
  HackerNews: 'hackernews'
}

const Indicator = ({ username, site }) => {
  // TODO update following IDs with real one before release
  const urls = {
    'v2ex': 'https://www.v2ex.com/t/448655',
    'github': 'https://github.com/metrue/asmalltalk/issues/66',
    'hackernews': 'https://news.ycombinator.com/item?id=17160588'
  }
  const {
    v2ex_post,
    github_issue,
    hackernews_post,
    note_how_to,
    note_register
  } = text[LANG]
  const messages = {
    'v2ex': v2ex_post,
    'github': github_issue,
    'hackernews': hackernews_post
  }

  if (!username || !site) {
    return <div />
  }

  return (
    <p>
      {note_how_to} <a target='_blank' href={urls[site]}>{ messages[site] } </a> {note_register}
    </p>
  )
}

class RegistrationSection extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      usernameIsValid: false,
      email: '',
      site: '',
      code: '',

      copied: false,
      submitStatus: SubmitStatus.Default
    }

    this.onUserNameSubmit = this.onUserNameSubmit.bind(this)
    this.onEmailSubmit = this.onEmailSubmit.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSiteClick = this.handleSiteClick.bind(this)
  }

  componentDidMount () {
    const clipboard = new ClipboardJS('.clipboard')
    clipboard.on('success', () => {
      this.setState({ copied: true })
    })

    clipboard.on('error', (e) => {
      this.setState({ copied: false })
    })
  }

  async onUserNameSubmit (username) {
    const { site } = this.state
    if (!site) {
      alert('you have to chose a site')
    }

    let valid = false
    if (site === SiteEnum.V2ex) {
      valid = await api.isV2exUser({ username })
    } else if (site === SiteEnum.Github) {
      valid = await api.isGithubUser({ username })
    } else if (site === SiteEnum.HackerNews) {
      valid = await api.isHackernewsUser({ username })
    }
    this.setState({ username, usernameIsValid: valid })

    return valid
  }

  async getCode () {
    const { username, email, site } = this.state
    this.setState({ code: 'Loading ...' })
    const { code } = await api.getCode({ username, email, site })
    this.setState({ code })
  }

  async onEmailSubmit (email) {
    const ok = maybeEmailAddress(email)
    if (ok) {
      this.setState({ email }, async () => {
        await this.getCode()
      })
    }
    return ok
  }

  verifyCodeTip () {
    const { verified, loadingCount } = this.state
    if (verified) {
      return '✓ 账号验证成功'
    } else if (loadingCount > 0) {
      return '验证中' + '.'.repeat(loadingCount % 4)
    } else {
      return ''
    }
  }

  handleSubmit () {
    const { code, username, email, site } = this.state
    const { onSubmit } = this.props
    this.setState({ submitStatus: SubmitStatus.Submitting })
    onSubmit({ code, username, email, site }, (err, data) => {
      if (err) {
        this.setState({ submitStatus: SubmitStatus.Failed })
      } else {
        this.setState({ submitStatus: SubmitButton.Succeed })
      }
    })
  }

  handleSiteClick (site) {
    this.setState({ site })
  }

  render () {
    const {
      email,
      username,
      usernameIsValid,
      site,
      code,
      submitStatus
    } = this.state

    const {
      home_title,
      registration_button_text,
      registering,
      registration_ok,
      registration_failed,
      input_id_note_text_id,
      input_email_note_text_id,
      verify_code
    } = text[LANG]

    let message = registration_button_text
    if (submitStatus === SubmitStatus.Submitting) {
      message = registering
    } else if (submitStatus === SubmitStatus.Succeed) {
      message = registration_ok
    } else if (submitStatus === SubmitStatus.Failed) {
      message = registration_failed
    }

    const isReady = email.length > 0 && code.length > 0 && usernameIsValid

    const sites = [
      {
        name: SiteEnum.Github,
        url: ''
      },
      {
        name: SiteEnum.HackerNews,
        url: ''
      },
      {
        name: SiteEnum.V2ex,
        url: ''
      }
    ]
    const buttonStyle = styles.SiteButton + ' btn btn-sm btn-outline-secondary'
    const buttonClickedStyle = buttonStyle + ` ${styles.SiteButtonClicked}`
    return (
      <div className={styles.RegistrationContainer}>
        <TitleBox title={home_title} />
        <div className={styles.FormContainer + ` mb-3`}>
          {
            sites.map((s) => (
              <button
                type='button'
                className={site === s.name ? buttonClickedStyle : buttonStyle}
                onClick={() => this.handleSiteClick(s.name)}
              >
                {s.name}
              </button>
            ))
          }
        </div>
        <div className={styles.FormContainer}>
          <InputRow
            type='text'
            label={input_id_note_text_id}
            placeholder='ID'
            disabled={!site}
            onSubmit={this.onUserNameSubmit}
          />
          <InputRow
            type='email'
            label={input_email_note_text_id}
            placeholder='Email'
            disabled={!usernameIsValid}
            onSubmit={this.onEmailSubmit}
          />
          <div>
            <Indicator username={username} site={site} />
            <div className='input-group mb-3'>
              <input
                className='form-control'
                placeholder={verify_code}
                aria-label={verify_code}
                type='text'
                id='MagicCode'
                value={code}
                disabled={!usernameIsValid || !email}
              />
              <div className='input-group-append'>
                <button
                  className='btn btn-outline-secondary clipboard'
                  type='button'
                  disabled={!usernameIsValid || !email || !code}
                  data-clipboard-target='#MagicCode'
                  data-clipboard-action='copy'
                >
                  <img src={screenshot} reandonly width='16' alt='复制' />
                </button>
              </div>
            </div>
            <p> {this.verifyCodeTip()}</p>
          </div>
          <SubmitButton
            status={submitStatus}
            message={message}
            handleSubmit={this.handleSubmit}
            disabled={!isReady}
          />
        </div>
      </div>
    )
  }
}

export default RegistrationSection
