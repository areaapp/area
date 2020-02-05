package com.example.area_android

import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.Drawable
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Patterns
import android.view.WindowManager
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.Toast
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.jsonBody
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import com.google.android.material.button.MaterialButton
import net.steamcrafted.materialiconlib.MaterialDrawableBuilder
import org.json.JSONArray
import org.json.JSONObject

class RegisterActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        val app = this.application as AreaApplication

        // Prevent keyboard to show up at activity start
        window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN)

        val loginButton = findViewById<MaterialButton>(R.id.register_loginButton)
        loginButton.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java) // New activity

            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
            startActivity(intent)
            finish() // Call once you redirect to another activity
        }

        val ip = findViewById<EditText>(R.id.register_ip)
        val port = findViewById<EditText>(R.id.register_port)
        val connectButton = findViewById<Button>(R.id.register_connectButton)

        connectButton.setOnClickListener {
            app.serverIp = ip.text.toString()
            app.serverPort = port.text.toString()
            app.generateServerUrl()

            val url: String = app.serverUrl!! + "/services"
            Fuel.get(url)
                .responseJson { request, response, result ->
                    when (result) {
                        is Result.Failure -> {
                            Toast.makeText(
                                this,
                                "Connection to the server failed",
                                Toast.LENGTH_LONG
                            ).show()
                        }
                        is Result.Success -> {
                            Toast.makeText(this, "Connected to the server", Toast.LENGTH_SHORT)
                                .show()
                            this.addServices(result.get().obj())
                            this.enableAll()
                        }
                    }
                }
        }

        val registerButton = findViewById<MaterialButton>(R.id.register_registerButton)
        registerButton.setOnClickListener {
            val email = findViewById<EditText>(R.id.register_email).text.toString()
            val username = findViewById<EditText>(R.id.register_username).text.toString()
            val password = findViewById<EditText>(R.id.register_password).text.toString()
            val repeatPassword = findViewById<EditText>(R.id.register_passwordRepeat).text.toString()

            this.basicRegister(username, email, password, repeatPassword)
        }
    }

    private fun basicRegister(username: String, email: String, password: String, repeatPassword: String) {
        if (username.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Invalid information", Toast.LENGTH_SHORT).show()
        } else if (password != repeatPassword) {
            Toast.makeText(this, "Passwords don't match", Toast.LENGTH_SHORT).show()
        } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            Toast.makeText(this, "Invalid email", Toast.LENGTH_SHORT).show()
        } else {
            val app = this.application as AreaApplication
            val url = app.serverUrl + "/auth/signup"
            val data = hashMapOf<String, Any?>(
                "email" to email,
                "password" to password,
                "username" to username
            )

            Fuel.post(url)
                .jsonBody(JSONObject(data).toString())
                .responseJson { request, response, result ->
                    when (result) {
                        is Result.Failure -> {
                            println(result.error)
                            Toast.makeText(this, "Invalid credentials", Toast.LENGTH_LONG).show()
                        }
                        is Result.Success -> {
                            Toast.makeText(this, "Account created", Toast.LENGTH_SHORT).show()
                            val obj = result.get().obj()
                            val data: JSONObject = obj.getJSONObject("data")

                            app.token = data.getString("token")
                            val intent = Intent(this, MainActivity::class.java)

                            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
                            startActivity(intent)
                            finish()
                        }
                    }
                }
        }
    }

    private fun addServices(obj: JSONObject) {
        val serviceButtonsLayout = findViewById<LinearLayout>(R.id.register_serviceButtonsLayout)

        val data: JSONArray = obj.getJSONArray("data")
        for (i in 0 until data.length()) {
            val service: JSONObject = data.getJSONObject(i)
            val icon = service.getString("iconName").replace('-', '_').toUpperCase()

            val d: Drawable =
                MaterialDrawableBuilder.with(this) // provide a context
                    .setIcon(MaterialDrawableBuilder.IconValue.valueOf(icon)) // provide an icon
                    .setColor(Color.WHITE) // set the icon color
                    .setToActionbarSize() // set the icon size
                    .build() // Finally call build

            val button = MaterialButton(this)
            button.text = service.getString("displayName")
            button.icon = d
            button.setOnClickListener {
                this.redirectToService(service.getString("name"))
            }

            serviceButtonsLayout.addView(button)
        }
    }

    private fun redirectToService(serviceName: String) {
        val app = this.application as AreaApplication

        if (serviceName == "dropbox") {
            val intent = Intent(this, DropboxAuthActivity::class.java)

            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
            startActivity(intent)
            finish()
            return
        }

        val url = app.serverUrl + "/auth/oauth/authorize_url/$serviceName/android"
        Fuel.get(url)
            .responseJson() { request, response, result ->
                val data = result.get().obj().getString("data")

                app.redirectAction = AreaApplication.ActionType.Signin
                val webpage: Uri = Uri.parse(data)
                val intent = Intent(Intent.ACTION_VIEW, webpage)
                startActivity(intent)
            }
    }

    private fun enableAll() {
        findViewById<EditText>(R.id.register_username).isEnabled = true
        findViewById<EditText>(R.id.register_email).isEnabled = true
        findViewById<EditText>(R.id.register_password).isEnabled = true
        findViewById<EditText>(R.id.register_passwordRepeat).isEnabled = true
        findViewById<MaterialButton>(R.id.register_registerButton).isEnabled = true
    }
}
