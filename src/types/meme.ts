export interface MemeTemplate {
  id: string
  name: string
  url: string
  width: number
  height: number
  box_count?: number
  source?: string
  thumbnail?: string
  sourceUrl?: string
}

export interface TextBox {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  color: string
  strokeColor: string
  strokeWidth: number
  shadowEnabled: boolean
  rotation: number
}

export interface MemeState {
  topText: string
  bottomText: string
  fontSize: number
  textColor: string
  topOffset: number
  bottomOffset: number
  template: MemeTemplate | null
  fontFamily: string
  strokeColor: string
  strokeWidth: number
  shadowEnabled: boolean
}

export interface FavoriteMeme {
  id: string
  image: string
  topText: string
  bottomText: string
  date: string
}
