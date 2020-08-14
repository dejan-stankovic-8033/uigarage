/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable camelcase */
import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import COLOR_PLATFORM_QUERY from '../queries/header_filter'

const MySelect = dynamic(
  () => import('react-select'),
  { ssr: false }
)

const HFilter = (props) => {
  const router = useRouter()
  const [colors, setcolors] = useState()
  const [platforms, setplatforms] = useState()
  const [defaultColorVal, setDefaultColorVal] = useState('')
  const [defaultPlatformVal, setDefaultPlatformVal] = useState('')
  const { loading, error, data } = useQuery(
    COLOR_PLATFORM_QUERY
  )

  useEffect(() => {
    const asPath = router.asPath
    const baseRouter = asPath.split('/')
    if (baseRouter[1] === 'platform') {
      const defaultVal = { value: { uri: `/${baseRouter[1]}/${baseRouter[2]}/`, id: `${baseRouter[3]}/${baseRouter[4]}` }, label: `${baseRouter[2]} (${baseRouter[4]})` }
      setDefaultPlatformVal(defaultVal)
    }
    if (baseRouter[1] === 'color') {
      const defaultVal = { value: { uri: `/${baseRouter[1]}/${baseRouter[2]}/`, id: `${baseRouter[3]}/${baseRouter[4]}` }, label: `${baseRouter[2]} (${baseRouter[4]})` }
      setDefaultColorVal(defaultVal)
    }
  }, [props])

  useEffect(() => {
    const onCompleted = (data) => {
      if (data && data.colors && data.platforms) {
        const colors_option = [{ value: { uri: '/', id: '' }, label: 'All colors' }]
        const platforms_option = [{ value: { uri: '/', id: '' }, label: 'All platforms' }]
        data.colors.nodes.map((color) => {
          colors_option.push({ value: { uri: color.uri, id: `${color.id}/${color.count}` }, label: `${color.name}  (${color.count})` })
        })
        data.platforms.nodes.map((platform) => {
          platforms_option.push({ value: { uri: platform.uri, id: `${platform.id}/${platform.count}` }, label: `${platform.name} (${platform.count})` })
        })
        setcolors(colors_option)
        setplatforms(platforms_option)
      }
    }
    const onError = (error) => {
      return <div>{error}</div>
    }
    if (onCompleted || onError) {
      if (onCompleted && !loading && !error) {
        onCompleted(data)
      } else if (onError && !loading && error) {
        onError(error)
      }
    }
  }, [data])

  const handleChange = (selectedOption) => {
    router.push(`${selectedOption.value.uri}${selectedOption.value.id}`)
  }

  return (
    <div className="container mx-auto h-filter-group">
      <div className="flex flex-wrap">
        <div className="w-1/2 md:w-1/2 lg:w-1/2 fl-item px-1">
          <MySelect options={colors} className="mt-1 h-filter" onChange={handleChange} placeholder="All colors" value={defaultColorVal} />
        </div>
        <div className="w-1/2 md:w-1/2 lg:w-1/2 fl-item px-1">
          <MySelect options={platforms} className="mt-1 h-filter" onChange={handleChange} placeholder="All platforms" value={defaultPlatformVal} />
        </div>
      </div>
    </div>
  )
}

export default HFilter
