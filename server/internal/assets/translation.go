package assets

type Root struct {
	Language   Language   `json:"language"`
	Auth       Auth       `json:"auth"`
	Onboarding Onboarding `json:"onboarding"`
	Countries  Countries  `json:"countries"`
	Profile    Profile    `json:"profile"`
}

type Language struct {
	Name  string `json:"name"`
	Short string `json:"short"`
}

type Auth struct {
	HelloTitle            string `json:"hellotitle"`
	HelloMessage          string `json:"hellomsg"`
	Next                  string `json:"next"`
	Start                 string `json:"start"`
	PhoneTitle            string `json:"phoneTitle"`
	PhoneDescription      string `json:"phoneDescription"`
	PhoneHint             string `json:"phoneHint"`
	ConfirmPhoneTitle     string `json:"confirmPhoneTitle"`
	Edit                  string `json:"edit"`
	Yes                   string `json:"yes"`
	Continue              string `json:"continue"`
	CodeTitle             string `json:"codeTitle"`
	CodeDescription       string `json:"codeDescription"`
	PasswordRequiredTitle string `json:"passwordRequiredTitle"`
	PasswordRequiredMsg   string `json:"passwordRequiredMessage"`
	PasswordTitle         string `json:"passwordTitle"`
	PasswordDescription   string `json:"passwordDescription"`
	PasswordHint          string `json:"passwordHint"`
	WrongPassword         string `json:"wrongPassword"`
	WrongPasswordMessage  string `json:"wrongPasswordMessage"`
	ShowPassword          string `json:"showPassword"`
	HidePassword          string `json:"hidePassword"`
	Understood            string `json:"understood"`
	CodeErrorTitle        string `json:"codeErrorTitle"`
	NetworkError          string `json:"networkError"`
	ExpiredCode           string `json:"expiredCode"`
	ExpiredCodeMessage    string `json:"expiredCodeMessage"`
	TooManyAttempts       string `json:"tooManyAttempts"`
	TryLater              string `json:"tryLater"`
	WrongCode             string `json:"wrongCode"`
	WrongCodeMessage      string `json:"wrongCodeMessage"`
	CodeUnavailable       string `json:"codeUnavailable"`
	TelegramRateLimit     string `json:"telegramRateLimit"`
	CodeRequestFailed     string `json:"codeRequestFailed"`
	CheckPhone            string `json:"checkPhone"`
}

type Onboarding struct {
	SourceTitle            string `json:"sourceTitle"`
	SourceDescription      string `json:"sourceDescription"`
	PlatformTitle          string `json:"platformTitle"`
	PlatformDescription    string `json:"platformDescription"`
	CommunicateTitle       string `json:"communicateTitle"`
	CommunicateDescription string `json:"communicateDescription"`
	AudienceTitle          string `json:"audienceTitle"`
	AudienceDescription    string `json:"audienceDescription"`
	MusicTitle             string `json:"musicTitle"`
	MusicDescription       string `json:"musicDescription"`
}

type Countries struct {
	Select      string `json:"select"`
	Search      string `json:"search"`
	Recommended string `json:"recommended"`
	All         string `json:"all"`
	Anonymous   string `json:"anonymous"`
}

type Profile struct {
	LogoutTitle        string `json:"logoutTitle"`
	LogoutMessage      string `json:"logoutMessage"`
	Cancel             string `json:"cancel"`
	Logout             string `json:"logout"`
	LogoutFailed       string `json:"logoutFailed"`
	TryAgain           string `json:"tryAgain"`
	Title              string `json:"title"`
	Refresh            string `json:"refresh"`
	LogoutTooltip      string `json:"logoutTooltip"`
	Name               string `json:"name"`
	Phone              string `json:"phone"`
	AccountLoadFailed  string `json:"accountLoadFailed"`
	AccountUnavailable string `json:"accountUnavailable"`
	Retry              string `json:"retry"`
	Username           string `json:"username"`
}
