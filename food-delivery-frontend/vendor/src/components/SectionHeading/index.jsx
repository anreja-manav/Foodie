import React from 'react'

const SectionHeading = ({title}) => {
  return (
    <div className="flex items-center justify-between py-3">
      <h2 className="text-lg font-semibold text-white">
        {title}
      </h2>
    </div>
  )
}

export default SectionHeading
