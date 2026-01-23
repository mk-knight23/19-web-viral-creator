export interface MemeTemplate {
  id: string
  name: string
  url: string
  width: number
  height: number
  box_count: number
}

export interface MemeState {
  topText: string
  bottomText: string
  fontSize: number
  textColor: string
  topOffset: number
  bottomOffset: number
  template: MemeTemplate | null
}

export interface FavoriteMeme {
  id: string
  image: string
  topText: string
  bottomText: string
  date: string
}
